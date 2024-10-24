import { approachLinear } from "../../lib/math/number";
import { Undefined } from "../../lib/types/undefined";
import { IguanaLooks } from "../iguana/looks";
import { objIguanaPuppet } from "../iguana/obj-iguana-puppet";
import { PhysicsFaction, mxnPhysics } from "../mixins/mxn-physics";
import { mxnShadowFloor } from "../mixins/mxn-shadow-floor";

const IguanaLocomotiveConsts = {
    WalkingAcceleration: 0.3,
    WalkingDeceleration: 0.2,
    WalkingTopSpeed: 2.5,
    Gravity: 0.15,
};

function getDeceleratingDistance(absSpeed: number, deceleration: number) {
    const count = absSpeed / deceleration + 1;
    const countCeil = Math.ceil(count);
    const countError = countCeil - count;
    const errorCorrection = -countError * deceleration;
    return countCeil * (absSpeed + errorCorrection) / 2 - errorCorrection;
}

export enum ObjIguanaLocomotiveAutoFacingMode {
    CheckMoving,
    CheckSpeedX,
}

export function objIguanaLocomotive(looks: IguanaLooks.Serializable) {
    let autoFacingTarget = 0;

    let currentWalkToTarget = Undefined<number>();
    let hitWall = false;

    function* walkTo(x: number) {
        puppet.isDucking = false;

        if (Math.abs(puppet.x - x) < 3) {
            return;
        }

        puppet.isBeingPiloted = true;
        currentWalkToTarget = x;
        hitWall = false;
        const right = puppet.x < x;

        if (right) {
            puppet.isMovingLeft = false;
            puppet.isMovingRight = true;

            let abort = false;

            yield () =>
                (abort = currentWalkToTarget !== x
                    || !puppet.isMovingRight
                    || !puppet.isBeingPiloted
                    // TODO: This is a bug
                    // When you hit a wall, it should probably not count as abort!
                    || hitWall)
                || puppet.x + puppet.estimatedDecelerationDeltaX >= x;

            if (abort) {
                return;
            }

            puppet.isMovingRight = false;
        }
        else {
            puppet.isMovingRight = false;
            puppet.isMovingLeft = true;

            let abort = false;

            yield () =>
                (abort = currentWalkToTarget !== x
                    || !puppet.isMovingLeft
                    || !puppet.isBeingPiloted
                    // TODO: This is a bug
                    // When you hit a wall, it should probably not count as abort!
                    || hitWall)
                || puppet.x + puppet.estimatedDecelerationDeltaX <= x;

            if (abort) {
                return;
            }

            puppet.isMovingLeft = false;
        }

        puppet.isBeingPiloted = false;
        currentWalkToTarget = undefined;
    }

    const puppet = objIguanaPuppet(looks)
        // TODO not sure if that is the correct physics faction...
        .mixin(mxnPhysics, {
            gravity: IguanaLocomotiveConsts.Gravity,
            physicsFaction: PhysicsFaction.Player,
            physicsRadius: 10,
            physicsOffset: [0, -13],
            debug: false,
            onMove: (event) => {
                if (event.hitGround && !event.previousOnGround && event.previousSpeed.y > 1.2) {
                    puppet.landingFrames = 10;
                }
                if (event.hitWall) {
                    hitWall = true;
                }
            },
        })
        .mixin(mxnShadowFloor, { offset: [0, -1] })
        .merge({
            walkingTopSpeed: IguanaLocomotiveConsts.WalkingTopSpeed,
            isDucking: false,
            isMovingLeft: false,
            isMovingRight: false,
            isBeingPiloted: false,
            get estimatedDecelerationDeltaX() {
                return Math.sign(puppet.speed.x)
                    * getDeceleratingDistance(Math.abs(puppet.speed.x), IguanaLocomotiveConsts.WalkingDeceleration);
            },
            walkTo,
            autoFacingMode: ObjIguanaLocomotiveAutoFacingMode.CheckSpeedX,
        })
        .step(() => {
            if (
                (puppet.isMovingLeft && puppet.isMovingRight) || (!puppet.isMovingLeft && !puppet.isMovingRight)
                || puppet.isDucking
            ) {
                puppet.speed.x = approachLinear(puppet.speed.x, 0, IguanaLocomotiveConsts.WalkingDeceleration);
            }
            else if (puppet.isMovingLeft) {
                puppet.speed.x = Math.max(
                    puppet.speed.x - IguanaLocomotiveConsts.WalkingAcceleration,
                    -puppet.walkingTopSpeed,
                );
            }
            else if (puppet.isMovingRight) {
                puppet.speed.x = Math.min(
                    puppet.speed.x + IguanaLocomotiveConsts.WalkingAcceleration,
                    puppet.walkingTopSpeed,
                );
            }

            puppet.isAirborne = !puppet.isOnGround;

            puppet.airborneDirectionY = approachLinear(
                puppet.airborneDirectionY,
                -Math.sign(puppet.speed.y),
                puppet.speed.y > 0 ? 0.075 : 0.25,
            );

            if (puppet.speed.x !== 0) {
                puppet.pedometer += Math.abs(puppet.speed.x * 0.05);
            }
            else if (puppet.gait === 0) {
                puppet.pedometer = 0;
            }

            const gaitFactor = Math.max(0, Math.abs(puppet.speed.x) - IguanaLocomotiveConsts.WalkingAcceleration);
            puppet.gait = approachLinear(puppet.gait, Math.min(puppet.isAirborne ? 0 : gaitFactor, 1), 0.15);

            if (puppet.speed.x !== 0) {
                if (puppet.autoFacingMode === ObjIguanaLocomotiveAutoFacingMode.CheckSpeedX) {
                    autoFacingTarget = Math.sign(puppet.speed.x);
                }
                else if (puppet.isMovingLeft && puppet.speed.x < 0) {
                    autoFacingTarget = -1;
                }
                else if (puppet.isMovingRight && puppet.speed.x > 0) {
                    autoFacingTarget = 1;
                }
            }

            puppet.facing = approachLinear(
                puppet.facing,
                autoFacingTarget || Math.sign(puppet.facing),
                0.1,
            );

            puppet.ducking = approachLinear(puppet.ducking, puppet.isDucking ? 1 : 0, 0.075);
        }, 1);

    return puppet;
}

export type ObjIguanaLocomotive = ReturnType<typeof objIguanaLocomotive>;
