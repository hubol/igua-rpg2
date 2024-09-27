import { Container, DisplayObject, Graphics } from "pixi.js";
import { Vector, VectorSimple, vnew } from "../../lib/math/vector-type";
import { LocalTerrain } from "../objects/obj-terrain";
import { StepOrder } from "../objects/step-order";
import { Material } from "../systems/materials";

export enum PhysicsFaction {
    Player = 1,
    Enemy = 1 << 1,
}

interface PhysicsArgs {
    gravity: number;
    physicsRadius: number;
    physicsFaction?: PhysicsFaction | null;
    physicsOffset?: Vector;
    onMove?: (event: MoveEvent) => void;
    debug?: boolean;
}

export function mxnPhysics(
    obj: DisplayObject,
    { gravity, physicsRadius, physicsFaction = null, physicsOffset = vnew(), debug = false, onMove }: PhysicsArgs,
) {
    if (debug && obj instanceof Container) {
        for (const child of obj.children) {
            child.alpha = 0.5;
        }
        obj.addChild(
            new Graphics().step(gfx =>
                gfx.clear().beginFill(0xff0000).drawRect(
                    physicsOffset.x - physicsRadius,
                    physicsOffset.y - physicsRadius,
                    physicsRadius * 2,
                    physicsRadius * 2,
                )
            ),
        );
    }

    const positionDecimal = vnew();
    let setPositionDecimalOnTransformChanged = true;

    const cb = obj.transform.position.cb.bind(obj.transform);

    obj.transform.position.cb = () => {
        if (setPositionDecimalOnTransformChanged) {
            positionDecimal.x = obj.transform.position._x;
            positionDecimal.y = obj.transform.position._y;
        }
        cb();
    };

    return obj
        .track(mxnPhysics)
        .merge({
            speed: vnew(),
            gravity,
            isOnGround: false,
            physicsRadius,
            physicsFaction,
            physicsOffset,
            groundMaterial: Material.Earth,
        })
        .step(obj => {
            // TODO
            // Is this even necessary? If so, why?! Why doesn't rounding when rendering work?!
            setPositionDecimalOnTransformChanged = false;
            obj.at(positionDecimal);
            const event = move(obj);
            positionDecimal.at(obj.x, obj.y);
            obj.x = Math.round(obj.x);
            obj.y = Math.round(obj.y);
            setPositionDecimalOnTransformChanged = true;
            onMove?.(event);
        }, StepOrder.Physics);
}

export type MxnPhysics = ReturnType<typeof mxnPhysics>;

interface MoveEvent {
    hitGround: boolean;
    hitCeiling: boolean;
    hitWall: boolean;
    previousSpeed: Vector;
    previousOnGround: boolean;
}

const moveEvent = {
    previousSpeed: vnew(),
} as MoveEvent;

function move(obj: MxnPhysics) {
    obj.speed.y += obj.gravity;
    return applySpeedInSteps(obj);
}

interface ForceEvent {
    stopped: boolean;
}

const _forceEvent: ForceEvent = { stopped: false };

export function force(obj: MxnPhysics, vector: VectorSimple) {
    _forceEvent.stopped = false;

    // Speed to restore
    // push() will affect obj.speed
    // Yes, it is strange...
    // TODO shouldn't be necessary
    const speedX = obj.speed.x;
    const speedY = obj.speed.y;

    obj.speed.x = vector.x;
    obj.speed.y = vector.y;

    applySpeedInSteps(obj);
    _forceEvent.stopped = obj.speed.x === 0 && obj.speed.y === 0;

    // Popped
    obj.speed.x = speedX;
    obj.speed.y = speedY;

    return _forceEvent;
}

function applySpeedInSteps(obj: MxnPhysics) {
    const radius = obj.physicsRadius;
    const radiusSqrt = Math.sqrt(radius);

    let hsp = obj.speed.x;
    let vsp = obj.speed.y;

    let hspAbs = Math.abs(hsp);
    let vspAbs = Math.abs(vsp);

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

        PushWorkingState.floorY = Number.MAX_VALUE;
        PushWorkingState.ceilY = Number.MIN_VALUE;

        const r1 = push(obj, true);

        moveEvent.hitCeiling ||= r1.hitCeiling;
        moveEvent.hitGround ||= r1.hitGround;
        moveEvent.hitWall ||= r1.hitWall;
        let hitGround = r1.hitGround;
        let hitMaterial = r1.hitMaterial;

        const r2 = push(obj, false);

        moveEvent.hitCeiling ||= r2.hitCeiling;
        moveEvent.hitGround ||= r2.hitGround;
        moveEvent.hitWall ||= r2.hitWall;
        hitGround ||= r2.hitGround;
        hitMaterial ||= r2.hitMaterial;

        if (vspStep !== 0) {
            obj.isOnGround = hitGround;
            if (hitMaterial) {
                obj.groundMaterial = hitMaterial;
            }
        }

        if (obj.speed.x === 0) {
            hsp = 0;
        }

        if (obj.speed.y === 0) {
            vsp = 0;
        }

        hspAbs = Math.abs(hsp);
        vspAbs = Math.abs(vsp);
    }

    return moveEvent;
}

const PushWorkingState = {
    floorY: 0,
    ceilY: 0,
};

function push(obj: MxnPhysics, edgesOnly: boolean, correctPosition = true, result = _result) {
    const physicsOffsetX = obj.physicsOffset.x;
    const physicsOffsetY = obj.physicsOffset.y;

    const x = obj.x + physicsOffsetX;
    const y = obj.y + physicsOffsetY;

    const halfHeight = obj.physicsRadius;
    const halfWidth = obj.physicsRadius;

    result.hitCeiling = false;
    result.hitGround = false;
    result.hitWall = false;
    result.hitMaterial = undefined;

    const paddingHorizontal = edgesOnly ? 0 : halfWidth;

    const terrains = LocalTerrain.value;
    for (let i = 0; i < terrains.length; i++) {
        const terrain = terrains[i];
        const segments = terrain.segments;
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
                if (x <= x0 - paddingHorizontal || x >= x1 + paddingHorizontal) {
                    continue;
                }

                // How far along is the object along this segment
                const f = (x - x0) / (x1 - x0);

                const isSlope = y0 !== y1;

                const tan = (y1 - y0) / (x1 - x0);

                // Note: tan < 0 means "normal" is facing left, tan > 0 means facing right
                const horizontalSpeedIndicatesClimbingSlope = Math.sign(tan) === -Math.sign(obj.speed.x);

                const tanA = Math.abs(tan);
                const vCat = tanA * halfHeight;

                if (segment.isCeiling) {
                    // Previously, the statements here were guarded by a check to determine
                    // whether the physics object was moving down OR the segment was a slope
                    // (See Git history for fewer lies)
                    // This was not sufficient to keep the physics object out of ceiling slopes
                    // that overlapped with other ceilings
                    {
                        // Computes the expected Y-coordinate where the object should
                        // touch this segment at its current X-coordinate
                        const touchY = Math.min(Math.max(y0, y1), y0 + (y1 - y0) * f + vCat);

                        // Snap to the segment only when we are close enough
                        // Note: Oddwarg's condition was
                        // y > touchY - halfHeight && y < touchY + halfHeight + vSnap
                        // But it seemed too generous.
                        // There is also no need to vertically snap to the ceiling
                        if (y > touchY && y < touchY + halfHeight && touchY > PushWorkingState.ceilY) {
                            PushWorkingState.ceilY = touchY;

                            if (correctPosition) {
                                obj.y = touchY + halfHeight - physicsOffsetY;
                                if (obj.speed.y < 0) {
                                    obj.speed.y = 0;
                                }
                            }
                            result.hitCeiling = true;
                            result.hitMaterial = terrain.iguaMaterial;
                        }
                    }
                }
                // Added edgesOnly (isSlope && edgesOnly && horizontalSpeedIndicatesClimbingSlope) ||
                // So that while jumping up a slope, you can still collide with it
                // It's possible this change should be replicated to the other kinds of segments
                else if ((isSlope && edgesOnly && horizontalSpeedIndicatesClimbingSlope) || obj.speed.y >= 0) {
                    const touchY = Math.max(Math.min(y0, y1), y0 + (y1 - y0) * f - vCat);

                    // Slope edges are greedier
                    // But not pipe slopes, I guess...
                    const thickSlopeEdge = isSlope && edgesOnly && !segment.isPipe ? halfHeight : 0;

                    // Enables you to be snapped to the floor while walking down a slope
                    // obj.speed.y >= 0 check added to allow jumping while walking up slopes
                    const vSnap = (obj.speed.y >= 0 && !horizontalSpeedIndicatesClimbingSlope)
                        ? Math.abs(obj.speed.x)
                        : 0;

                    // Note: Oddwarg's condition was
                    // y > touchY - halfHeight - vSnap && y < touchY + halfHeight
                    // But it seemed too generous.
                    if (
                        y > touchY - halfHeight - vSnap && y < touchY + thickSlopeEdge
                        && touchY < PushWorkingState.floorY
                    ) {
                        // Adjusting touchY allows less snapping when climbing pipe "stairwells"
                        // TODO: Not sure if -halfHeight is correct
                        PushWorkingState.floorY = touchY
                            + ((segment.isPipe && edgesOnly && isSlope && horizontalSpeedIndicatesClimbingSlope)
                                ? -halfHeight
                                : 0);

                        if (correctPosition) {
                            obj.y = touchY - halfHeight - physicsOffsetY;
                            // e.g. If you are jumping up a slope, only correct position
                            if (obj.speed.y >= 0) {
                                obj.speed.y = 0;
                            }
                        }
                        result.hitGround = true;
                        result.hitMaterial = terrain.iguaMaterial;
                    }
                }
            }
            // Note: Some optimizations can be made for walls since IguaRPG 2 has the following assumptions:
            // - Walls will never be slopes
            // - Wall corners should not be processed
            else {
                if (y <= y0 || y >= y1) {
                    continue;
                }

                if ((segment.isWallFacingLeft && obj.speed.x >= 0) || (segment.isWallFacingRight && obj.speed.x <= 0)) {
                    const f = (y - y0) / (y1 - y0);
                    const touchX = Math.max(Math.min(x0, x1), x0 + (x1 - x0) * f);

                    if (x > touchX - halfWidth && x < touchX + halfWidth) {
                        if (correctPosition) {
                            const correctPositionOffset = segment.isWallFacingRight ? halfWidth : -halfWidth;
                            obj.x = touchX + correctPositionOffset - physicsOffsetX;
                            obj.speed.x = 0;
                        }
                        result.hitWall = true;
                        result.hitMaterial = terrain.iguaMaterial;
                    }
                }
            }
        }
    }

    return result;
}

interface PushResult {
    hitGround: boolean;
    hitCeiling: boolean;
    hitWall: boolean;
    hitMaterial?: Material;
}

const _result = {} as PushResult;
