import { Container, DisplayObject, Graphics } from "pixi.js";
import { Vector, vnew } from "../../lib/math/vector-type";
import { LocalWalls } from "../objects/obj-wall";
import { dot } from "../../lib/math/vector";

interface PhysicsArgs {
    gravity: number;
    physicsRadius: number;
    physicsOffset?: Vector;
    // TODO allow specifying debug color?
    debug?: boolean;
}

// TODO should it actually accept + apply gravity?
export function mxnPhysics(obj: DisplayObject, { gravity, physicsRadius, physicsOffset = vnew(), debug = false }: PhysicsArgs) {
    if (debug && obj instanceof Container)
        obj.addChild(new Graphics().step(gfx => gfx.clear().beginFill(0xff0000).drawCircle(physicsOffset.x, physicsOffset.y, physicsRadius)));

    return obj
        .merge({ speed: vnew(), gravity, isOnGround: false, physicsRadius, physicsOffset })
        .step(obj => {
            // TODO some objects need to handle the result from move, how should that happen?
            move(obj);
        }, 1000)
}

export type MxnPhysics = ReturnType<typeof mxnPhysics>;

function move(obj: MxnPhysics) {
    const radius = obj.physicsRadius;
    const radiusSqrt = Math.sqrt(radius);

    let hsp = obj.speed.x;
    let vsp = obj.speed.y;

    let hspAbs = Math.abs(hsp);
    let vspAbs = Math.abs(vsp);

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

        if ((r.hitGround && vsp > 0) || (r.hitCeiling && vsp <= 0)) {
            obj.speed.y = 0;
            vsp = 0;
        }

        if (r.hitWall) {
            obj.speed.x = 0;
            hsp = 0;
        }

        obj.isOnGround = r.isOnGround!;

        hspAbs = Math.abs(hsp);
        vspAbs = Math.abs(vsp);
    }
}

const vObjPosition = vnew();
const v = vnew();

function push(obj: MxnPhysics, correctPosition = true, result = _result) {
    const physicsOffsetX = obj.physicsOffset.x;
    const physicsOffsetY = obj.physicsOffset.y;

    const xy = vObjPosition.at(obj).add(physicsOffsetX, physicsOffsetY);

    const speed = obj.speed;
    const radius = obj.physicsRadius;
    const radiusLessMaxSpeed = radius - Math.sqrt(radius) - radius * 0.1;

    result.isOnGround = false;
    result.hitCeiling = false;
    result.hitGround = false;
    result.hitWall = false;

    const wallProviders = LocalWalls.value;
    for (let i = 0; i < wallProviders.length; i++) {
        const walls = wallProviders[i].walls;
        for (let j = 0; j < walls.length; j++) {
            const wall = walls[j];

            if (wall.active === false)
                continue;
            const offset = v.at(xy.x - wall.x, xy.y - wall.y);
            const offsetDotNormal = dot(offset, wall.normal);
            const offsetDotForward = dot(offset, wall.forward);
            const speedDotNormal = dot(speed, wall.normal);

            const alongForward = (offsetDotForward > 0 && offsetDotForward < wall.length)
                || (offsetDotForward > -radius && offsetDotForward < (wall.length + radius) && offsetDotNormal >= radiusLessMaxSpeed);
            
            const absOffsetDotNormal = Math.abs(offsetDotNormal);

            // TODO name needs work, value is eerily similar to shouldCorrectPosition
            const shouldCorrectPosition = alongForward && speedDotNormal < 0 && absOffsetDotNormal < radius;
            const isOnGround = wall.isGround && alongForward && absOffsetDotNormal <= radius * 1.01 && speedDotNormal <= 0;

            if (isOnGround) {
                result.isOnGround = true;
                // result.solidNormal = wall.normal;
                // if (stopIfOnGround)
                //     break;
            }

            if (shouldCorrectPosition) {
                if (isOnGround)
                    result.hitGround = true;
                if (wall.isCeiling)
                    result.hitCeiling = true;
                if (wall.isWall)
                    result.hitWall = true;

                // result.solidNormal = wall.normal;

                if (correctPosition) {
                    obj.x = wall.x + wall.forward.x * offsetDotForward + wall.normal.x * radius - physicsOffsetX;
                    obj.y = wall.y + wall.forward.y * offsetDotForward + wall.normal.y * radius - physicsOffsetY;
                }
            }
        }
    }

    return result;
}

interface PushResult
{
    isOnGround?: boolean;
    hitGround?: boolean;
    hitCeiling?: boolean;
    hitWall?: boolean;
    // solidNormal?: Vector;
}

const _result: PushResult = {};