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
        obj.addChild(new Graphics().step(gfx => gfx.clear().beginFill(0xff0000).drawCircle(physicsOffset.x, physicsOffset.y, physicsRadius)));
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

        const r = push(obj);

        moveEvent.hitCeiling ||= r.hitCeiling;
        moveEvent.hitGround ||= r.hitGround;
        moveEvent.hitWall ||= r.hitWall;

        if (vspStep !== 0) {
            obj.isOnGround = r.hitGround!;
            // Crude mechanism to prevent sliding down slopes while standing
            if (gravityOnlyStep && r.hitGround) {
                obj.x = previousX;
                obj.y = previousY;
                obj.speed.y = 0;
                return moveEvent;
            }
        }

        if ((r.hitGround && vspStep > 0) || (r.hitCeiling && vspStep <= 0)) {
            obj.speed.y = 0;
            vsp = 0;
        }

        if (r.hitWall) {
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

function push(obj: MxnPhysics, correctPosition = true, result = _result) {
    const physicsOffsetX = obj.physicsOffset.x;
    const physicsOffsetY = obj.physicsOffset.y;

    const xy = vObjPosition.at(obj).add(physicsOffsetX, physicsOffsetY);

    const speed = obj.speed;
    const radius = obj.physicsRadius;
    // const radiusLessMaxSpeed = radius - Math.sqrt(radius) - radius * 0.1;
    
    result.hitCeiling = false;
    result.hitGround = false;
    result.hitWall = false;

    const terrains = LocalTerrain.value;
    for (let i = 0; i < terrains.length; i++) {
        const segments = terrains[i].segments;
        for (let j = 0; j < segments.length; j++) {
            const segment = segments[j];

            if (segment.active === false)
                continue;

            const testForward = segment.slope?.forward ?? segment.forward;
            const testLength = segment.slope?.width ?? segment.length;

            const isGroundSlope = segment.isGround && segment.normal.y !== -1;

            const testNormal = isGroundSlope ? Compass.North : segment.normal;

            const offset = v.at(xy.x - segment.x, xy.y - segment.y);
            const offsetDotNormal = dot(offset, segment.normal);
            const offsetDotForward = dot(offset, testForward) / testLength;
            const speedDotNormal = dot(speed, segment.normal);

            const onForward = offsetDotForward > 0 && offsetDotForward < 1;
            
            const absOffsetDotNormal = Math.abs(offsetDotNormal);

            const movingDownSlope = isGroundSlope
                && onForward
                // Jank to try and snap to slopes only when you recently fell off a ground block
                && speed.y >= 0 && speed.y <= obj.gravity * 2
                && Math.sign(speed.x) === Math.sign(segment.normal.x)
                && absOffsetDotNormal < radius * 2;

            const shouldCorrectPosition = movingDownSlope
                || (onForward && speedDotNormal < 0 && absOffsetDotNormal < radius);

            if (shouldCorrectPosition) {
                if (segment.isGround)
                    result.hitGround = true;
                if (segment.isCeiling)
                    result.hitCeiling = true;
                if (segment.isWall)
                    result.hitWall = true;

                // result.solidNormal = wall.normal;

                if (correctPosition) {
                    const offsetDotForwardTimesLength = offsetDotForward * segment.length;
                    if (!movingDownSlope)
                        obj.x = segment.x + segment.forward.x * offsetDotForwardTimesLength + testNormal.x * radius - physicsOffsetX;
                    if (!segment.isWall)
                        obj.y = segment.y + segment.forward.y * offsetDotForwardTimesLength + testNormal.y * radius - physicsOffsetY;
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
    // solidNormal?: Vector;
}

const _result = {} as PushResult;