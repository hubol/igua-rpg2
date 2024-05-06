import { Container, DisplayObject, Graphics } from "pixi.js";
import { Vector, vnew } from "../../lib/math/vector-type";
import { LocalTerrain } from "../objects/obj-terrain";
import { dot } from "../../lib/math/vector";
import { Compass } from "../../lib/math/compass";

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

    const objSpeedYWasNotZero = obj.speed.y !== 0;
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

const vObjPosition = vnew();
const v = vnew();

function push(obj: MxnPhysics, edgesOnly: boolean, correctPosition = true, result = _result) {
    const physicsOffsetX = obj.physicsOffset.x;
    const physicsOffsetY = obj.physicsOffset.y;

    // const xy = vObjPosition.at(obj).add(physicsOffsetX, physicsOffsetY);
    const x = obj.x + physicsOffsetX;
    const y = obj.y + physicsOffsetY;

    const speedX = obj.speed.x;
    const speedY = obj.speed.y;

    // const speed = obj.speed;
    const halfHeight = obj.physicsRadius;
    const halfWidth = obj.physicsRadius;
    // const radiusLessMaxSpeed = radius - Math.sqrt(radius) - radius * 0.1;
    
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

            if (segment.isFloor || segment.isCeiling) {
                if (x <= x0 - paddingHorizontal || x >= x1 + paddingHorizontal)
                    continue;
                const f = (x - x0) / (x1 - x0);

				const tanA = Math.abs((y1 - y0) / (x1 - x0));
				const vCat = tanA * halfHeight;
				const vSnap = Math.abs(speedX);

                // console.log(f, tanA, vCat, vSnap);
				
				if (segment.isCeiling) {
					if (speedY <= 0) {
						// A valid point along this ceiling, where the player could be moved
						// Smaller of:
						// Start, end, or
						// Desired player position along this ceiling
						const touchY = Math.min(Math.max(y0, y1), y0 + (y1 - y0) * f + vCat);

						// If player Y position is greater than  
						// the valid point
						if (y > touchY - halfHeight && y < touchY + halfHeight + vSnap/* && touchY > ceilY*/) {
                            if (correctPosition)
							    obj.y = touchY + halfHeight - physicsOffsetY;
							// ceilY = touchY;
                            result.hitCeiling = true;
						}
					}
				}
				else if (speedY >= 0) {
                    const touchY = Math.max(Math.min(y0, y1), y0 + (y1 - y0) * f - vCat);
                    if (y > touchY - halfHeight - vSnap && y < touchY/* && touchY < floorY*/) {
                        if (correctPosition)
                            obj.y = touchY - halfHeight - physicsOffsetY;
                        // floorY = touchY;
                        result.hitGround = true;
                    }
                }
            }
            else {
                if (y <= y0 - paddingVertical || y >= y1 + paddingVertical)
                    continue;
				const f = (y - y0) / (y1 - y0);

				const tanA = Math.abs((x1 - x0) / (y1 - y0));
				const hCat = tanA * halfHeight;
				const hSnap = Math.abs(speedY);
				
				if (segment.isWallFacingLeft) {
					if (speedX >= 0) {
						const touchX = Math.max(Math.min(x0, x1), x0 + (x1 - x0) * f - hCat);
						if (x > touchX - halfHeight - hSnap && x < touchX + halfHeight/* && touchX < wallL*/) {
                            if (correctPosition)
							    obj.x = touchX - halfHeight - physicsOffsetX;
							// wallL = touchX;
							result.hitWall = true;
						}
					}
				}
				else if (speedX <= 0) {
					const touchX = Math.min(Math.max(x0, x1), x0 + (x1 - x0) * f + hCat);
                    if (x > touchX - halfHeight && x < touchX + halfHeight + hSnap/* && touchX > wallR*/) {
                        if (correctPosition)
                            obj.x = touchX + halfHeight - physicsOffsetX;
                        // wallR = touchX;
                        result.hitWall = true;
                    }
				}
            }

            // if (segment.active === false || (!edgesOnly && segment.isWall))
            //     continue;

            // const testForward = segment.slope?.forward ?? segment.forward;
            // const testLength = segment.slope?.width ?? segment.length;

            // const offset = v.at(xy.x - segment.x, xy.y - segment.y);
            // const offsetDotForward = dot(offset, testForward);

            // const isGroundSlope = segment.isGround && segment.normal.y !== -1;
            // const testNormal = isGroundSlope ? Compass.North : segment.normal;

            // const onForward = offsetDotForward > -padding && offsetDotForward < testLength + padding;

            // if (!onForward)
            //     continue;

            // const offsetDotNormal = dot(offset, segment.normal);
            // const speedDotNormal = dot(speed, segment.normal);
            
            // const absOffsetDotNormal = Math.abs(offsetDotNormal);

            // const movingDownSlope = isGroundSlope
            //     // Jank to try and snap to slopes only when you recently fell off a ground block
            //     && speed.y >= 0 && speed.y <= obj.gravity * 2
            //     && Math.sign(speed.x) === Math.sign(segment.normal.x)
            //     && absOffsetDotNormal < radius * 2;

            // const shouldCorrectPosition = movingDownSlope
            //     || (speedDotNormal < 0 && absOffsetDotNormal < radius);

            // if (shouldCorrectPosition) {
            //     // if (segment.isGround)
            //     //     console.log(offsetDotNormal);

            //     if (segment.isGround)
            //         result.hitGround = true;
            //     if (segment.isCeiling)
            //         result.hitCeiling = true;
            //     if (segment.isWall)
            //         result.hitWall = true;

            //     // result.solidNormal = wall.normal;

            //     if (correctPosition) {
            //         const normalizedOffsetDotForward = offsetDotForward / testLength;
            //         if (!movingDownSlope)
            //             obj.x = segment.x + segment.forward.x * normalizedOffsetDotForward * segment.length + testNormal.x * radius - physicsOffsetX;
            //         if (!segment.isWall) {
            //             // Clamping is to prevent extension of slopes due to "padding" introduced above
            //             obj.y = segment.y + segment.forward.y * Math.max(0, Math.min(1, normalizedOffsetDotForward)) * segment.length + testNormal.y * radius - physicsOffsetY;
            //         }
            //     }
            // }
        }
    }

    return result;
}

interface PushResult
{
    hitGround: boolean;
    hitCeiling: boolean;
    hitWall: boolean;
    // solidNormal?: Vector;
}

const _result = {} as PushResult;