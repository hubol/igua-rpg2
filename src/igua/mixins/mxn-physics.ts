import { Container, DisplayObject, Graphics } from "pixi.js";
import { Vector, vnew } from "../../lib/math/vector-type";
import { LocalTerrain } from "../objects/obj-terrain";

interface PhysicsArgs {
    gravity: number;
    physicsRadius: number;
    physicsOffset?: Vector;
    onMove?: (event: MoveEvent) => void;
    // TODO allow specifying debug color?
    debug?: boolean;
}

// TODO should it actually accept + apply gravity?
export function mxnPhysics(obj: DisplayObject, { gravity, physicsRadius, physicsOffset = vnew(), debug = false, onMove }: PhysicsArgs) {
    if (debug && obj instanceof Container) {
        for (const child of obj.children)
            child.alpha = 0.5;
        obj.addChild(new Graphics().step(gfx => gfx.clear().beginFill(0xff0000).drawRect(physicsOffset.x - physicsRadius, physicsOffset.y - physicsRadius, physicsRadius * 2, physicsRadius * 2)));
    }

    return obj
        .merge({ speed: vnew(), gravity, isOnGround: false, physicsRadius, physicsOffset })
        .step(obj => {
            const event = move(obj);
            onMove?.(event);
        }, 1000)
}

export type MxnPhysics = ReturnType<typeof mxnPhysics>;

type MoveEvent = Omit<PushResult, 'isOnGround'> & { previousSpeed: Vector; previousOnGround: boolean; };
const moveEvent = {
    previousSpeed: vnew(),
} as MoveEvent;

function move(obj: MxnPhysics) {
    const radius = obj.physicsRadius;
    const radiusSqrt = Math.sqrt(radius);

    const gravityOnlyStep = obj.speed.x === 0 && obj.speed.y === 0;

    obj.speed.y += obj.gravity;

    let hsp = obj.speed.x;
    let vsp = obj.speed.y;

    let hspAbs = Math.abs(hsp);
    let vspAbs = Math.abs(vsp);

    const previousX = obj.x;
    const previousY = obj.y;

    moveEvent.hitCeiling = false;
    moveEvent.hitGround = false;
    moveEvent.hitWall = false;
    moveEvent.previousSpeed!.at(obj.speed);
    moveEvent.previousOnGround = obj.isOnGround;

    // TODO dividing into steps might be overkill, not sure
    while (hspAbs > 0 || vspAbs > 0) {
        const hspSign = Math.sign(hsp);
        const vspSign = Math.sign(vsp);

        const hspLength = Math.min(hspAbs, vspAbs === 0 ? radius : radiusSqrt);
        const vspLength = Math.min(vspAbs, hspAbs === 0 ? radius : radiusSqrt);

        const hspStep = hspSign * hspLength;
        const vspStep = vspSign * vspLength;

        obj.x += hspStep;
        obj.y += vspStep;

        hsp = hspSign * Math.max(0, hspAbs - hspLength);
        vsp = vspSign * Math.max(0, vspAbs - vspLength);

        const r1 = push(obj, true);

        moveEvent.hitCeiling ||= r1.hitCeiling;
        moveEvent.hitGround ||= r1.hitGround;
        moveEvent.hitWall ||= r1.hitWall;
        let hitGround = r1.hitGround;

        const r2 = push(obj, false);

        moveEvent.hitCeiling ||= r2.hitCeiling;
        moveEvent.hitGround ||= r2.hitGround;
        moveEvent.hitWall ||= r2.hitWall;
        hitGround ||= r2.hitGround;

        if (vspStep !== 0) {
            obj.isOnGround = hitGround;
            // Crude mechanism to prevent sliding down slopes while standing
            if (gravityOnlyStep && hitGround) {
                obj.x = previousX;
                obj.y = previousY;
                obj.speed.y = 0;
                return moveEvent;
            }
        }

        if ((hitGround && vspStep > 0) || (moveEvent.hitCeiling && vspStep <= 0)) {
            obj.speed.y = 0;
            vsp = 0;
        }

        if (moveEvent.hitWall) {
            obj.speed.x = 0;
            hsp = 0;
        }

        hspAbs = Math.abs(hsp);
        vspAbs = Math.abs(vsp);
    }

    return moveEvent as MoveEvent;
}

function push(obj: MxnPhysics, edgesOnly: boolean, correctPosition = true, result = _result) {
    const physicsOffsetX = obj.physicsOffset.x;
    const physicsOffsetY = obj.physicsOffset.y;

    const x = obj.x + physicsOffsetX;
    const y = obj.y + physicsOffsetY;

    const speedX = obj.speed.x;
    const speedY = obj.speed.y;

    const halfHeight = obj.physicsRadius;
    const halfWidth = obj.physicsRadius;
    
    result.hitCeiling = false;
    result.hitGround = false;
    result.hitWall = false;

    const paddingHorizontal = edgesOnly ? 0 : halfWidth;
    const paddingVertical = 0;

    const terrains = LocalTerrain.value;
    for (let i = 0; i < terrains.length; i++) {
        const segments = terrains[i].segments;
        for (let j = 0; j < segments.length; j++) {
            const segment = segments[j];

            const x0 = segment.x0;
            const x1 = segment.x1;
            const y0 = segment.y0;
            const y1 = segment.y1;

            // The checks against different segments are very similar,
            // but difficult to unify without costing performance
            if (segment.isFloor || segment.isCeiling) {
                // Check if the object's position projected against the "forward"
                // indicates that we are along this segment
                // (Note: "forward" is inferred totally from the isFloor, isCeiling, etc discriminators)
                if (x <= x0 - paddingHorizontal || x >= x1 + paddingHorizontal)
                    continue;

                // How far along is the object along this segment
                const f = (x - x0) / (x1 - x0);

				const tanA = Math.abs((y1 - y0) / (x1 - x0));
				const vCat = tanA * halfHeight;

                // Enables you to be snapped to the floor while walking down a slope
                // ...Although this might introduce a strange quirk with running + jumping into ceilings
				const vSnap = Math.abs(speedX);
				
				if (segment.isCeiling) {
					if (speedY <= 0) {
                        // Computes the expected Y-coordinate where the object should
                        // touch this segment at its current X-coordinate
						const touchY = Math.min(Math.max(y0, y1), y0 + (y1 - y0) * f + vCat);

						// Snap to the segment only when we are close enough
						if (y > touchY - halfHeight && y < touchY + halfHeight + vSnap) {
                            if (correctPosition)
							    obj.y = touchY + halfHeight - physicsOffsetY;
                            result.hitCeiling = true;
						}
					}
				}
				else if (speedY >= 0) {
                    const touchY = Math.max(Math.min(y0, y1), y0 + (y1 - y0) * f - vCat);

                    // Note: Oddwarg's condition was
                    // y > touchY - halfHeight - vSnap && y < touchY + halfHeight
                    // But it seemed too generous.
                    if (y > touchY - halfHeight - vSnap && y < touchY) {
                        if (correctPosition)
                            obj.y = touchY - halfHeight - physicsOffsetY;
                        result.hitGround = true;
                    }
                }
            }
            // TODO: Verify if halfHeight should be used for wall segments
            // I am guessing it is a copy-paste fail
            else {
                if (y <= y0 - paddingVertical || y >= y1 + paddingVertical)
                    continue;
				const f = (y - y0) / (y1 - y0);

				const tanA = Math.abs((x1 - x0) / (y1 - y0));
				const hCat = tanA * halfHeight;
                // Note: Horizontal snap might be useful only for sloped walls
                // I don't think IguaRPG 2 will have these
                // With hSnap set to Math.abs(speedY), and with a high enough speedY
                // It is possible to be snapped to a wall while falling
                // Even without being anywhere near the wall 
				const hSnap = 0;//Math.abs(speedY);
				
				if (segment.isWallFacingLeft) {
					if (speedX >= 0) {
						const touchX = Math.max(Math.min(x0, x1), x0 + (x1 - x0) * f - hCat);
						if (x > touchX - halfHeight - hSnap && x < touchX + halfHeight) {
                            if (correctPosition)
							    obj.x = touchX - halfHeight - physicsOffsetX;
							result.hitWall = true;
						}
					}
				}
				else if (speedX <= 0) {
					const touchX = Math.min(Math.max(x0, x1), x0 + (x1 - x0) * f + hCat);
                    if (x > touchX - halfHeight && x < touchX + halfHeight + hSnap) {
                        if (correctPosition)
                            obj.x = touchX + halfHeight - physicsOffsetX;
                        result.hitWall = true;
                    }
				}
            }
        }
    }

    return result;
}

interface PushResult
{
    hitGround: boolean;
    hitCeiling: boolean;
    hitWall: boolean;
}

const _result = {} as PushResult;