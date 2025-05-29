import { approachLinear } from "../../lib/math/number";
import { Polar } from "../../lib/math/number-alias-types";
import { vnew } from "../../lib/math/vector-type";
import { Undefined } from "../../lib/types/undefined";
import { scene } from "../globals";
import { IguanaLooks } from "../iguana/looks";
import { objIguanaPuppet } from "../iguana/obj-iguana-puppet";
import { mxnPhysics, PhysicsFaction } from "../mixins/mxn-physics";
import { mxnShadowFloor } from "../mixins/mxn-shadow-floor";
import { StepOrder } from "./step-order";

export const IguanaLocomotiveConsts = {
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

export type ObjIguanaLocomotiveAutoFacingMode = "check_moving" | "check_speed_x";

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
                    || !puppet.isBeingPiloted)
                || hitWall
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
                    || !puppet.isBeingPiloted)
                || hitWall
                || puppet.x + puppet.estimatedDecelerationDeltaX <= x;

            if (abort) {
                return;
            }

            puppet.isMovingLeft = false;
        }

        puppet.isBeingPiloted = false;
        currentWalkToTarget = undefined;

        yield () => puppet.speed.x === 0;
    }

    const auto = {
        duckingSpeed: 0.075,
        facingMode: <ObjIguanaLocomotiveAutoFacingMode> "check_speed_x",
        set facing(value: Polar) {
            autoFacingTarget = value;
        },
    };

    // TODO move into auto?
    function setFacingOverrideAuto(value: Polar) {
        autoFacingTarget = value;
        puppet.facing = value;
    }

    const puppet = objIguanaPuppet(looks)
        // TODO not sure if that is the correct physics faction...
        .mixin(mxnPhysics, {
            gravity: IguanaLocomotiveConsts.Gravity,
            physicsFaction: PhysicsFaction.Player,
            physicsRadius: 10,
            physicsOffset: [0, -13],
            debug: false,
        })
        .handles("moved", (self, event) => {
            if (event.hitGround && !event.previousOnGround && event.previousSpeed.y > 1.2) {
                self.landingFrames = 10;
            }
            if (event.hitWall) {
                hitWall = true;
            }
        })
        .mixin(mxnShadowFloor, { offset: [0, -1] })
        .merge({
            walkingTopSpeed: IguanaLocomotiveConsts.WalkingTopSpeed,
            isDucking: false,
            isMovingLeft: false,
            isMovingRight: false,
            isMovingUp: false,
            isMovingDown: false,
            isBeingPiloted: false,
            get estimatedDecelerationDeltaX() {
                return Math.sign(puppet.speed.x)
                    * getDeceleratingDistance(Math.abs(puppet.speed.x), IguanaLocomotiveConsts.WalkingDeceleration);
            },
            walkTo,
            auto,
            setFacingOverrideAuto,
        })
        .step(() => {
            const effectiveWalkingSpeed = scene.isWorldMap ? puppet.speed.vlength : Math.abs(puppet.speed.x);

            if (effectiveWalkingSpeed !== 0) {
                puppet.pedometer += effectiveWalkingSpeed * 0.0375
                    + (effectiveWalkingSpeed / puppet.walkingTopSpeed) * 0.03125;
            }
            else if (puppet.gait === 0) {
                puppet.pedometer = 0;
            }

            const gaitFactor = Math.max(
                0,
                puppet.walkingTopSpeed < 1
                    ? (effectiveWalkingSpeed / puppet.walkingTopSpeed)
                    : effectiveWalkingSpeed - IguanaLocomotiveConsts.WalkingAcceleration,
            );
            puppet.gait = approachLinear(puppet.gait, Math.min(puppet.isAirborne ? 0 : gaitFactor, 1), 0.15);

            if (puppet.speed.x !== 0) {
                if (puppet.auto.facingMode === "check_speed_x") {
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

            puppet.ducking = approachLinear(puppet.ducking, puppet.isDucking ? 1 : 0, auto.duckingSpeed);
        }, 2);

    if (scene.isWorldMap) {
        puppet.step(self => {
            self.gravity = 0;
        }, StepOrder.TerrainClean)
            .step(self => {
                v.at(0, 0);
                if (self.isMovingDown) {
                    v.add(0, 1);
                }
                if (self.isMovingLeft) {
                    v.add(-1, 0);
                }
                if (self.isMovingRight) {
                    v.add(1, 0);
                }
                if (self.isMovingUp) {
                    v.add(0, -1);
                }

                if (v.isZero) {
                    puppet.speed.moveTowards(
                        v,
                        IguanaLocomotiveConsts.WalkingDeceleration,
                    );
                }
                else {
                    puppet.speed.moveTowards(
                        v.normalize().scale(puppet.walkingTopSpeed),
                        IguanaLocomotiveConsts.WalkingAcceleration,
                    );
                }
            });
    }
    else {
        puppet.step(() => {
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
        }, 1);
    }

    return puppet;
}

const v = vnew();

export type ObjIguanaLocomotive = ReturnType<typeof objIguanaLocomotive>;
