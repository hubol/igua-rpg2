import { DisplayObject, Graphics, Point } from "pixi.js";
import { Logger } from "../../lib/game-engine/logger";
import { factor } from "../../lib/game-engine/routines/interp";
import { sleep } from "../../lib/game-engine/routines/sleep";
import { ToRad } from "../../lib/math/angle";
import { Unit } from "../../lib/math/number-alias-types";
import { PseudoRng, Rng } from "../../lib/math/rng";
import { distance } from "../../lib/math/vector";
import { vnew } from "../../lib/math/vector-type";
import { container } from "../../lib/pixi/container";
import { Empty } from "../../lib/types/empty";
import { objFxBallon } from "../objects/effects/obj-fx-ballon";
import { objFxBallonPop } from "../objects/effects/obj-fx-ballon-pop";
import { StepOrder } from "../objects/step-order";
import { RpgStatus } from "../rpg/rpg-status";
import { mxnPhysics } from "./mxn-physics";

interface MxnBallonableArgs {
    attachPoint: DisplayObject;
    ballons: RpgStatus.Ballon[];
}

const p0 = new Point();
const p1 = new Point();
const prng = new PseudoRng();
const v = vnew();

function objBallon(ballon: RpgStatus.Ballon, inflation: Unit) {
    return objFxBallon(ballon.seed, inflation)
        .merge({ restOffset: vnew(), restOffsetTarget: vnew(), ballon })
        .step(self => {
            self.restOffset.moveTowards(self.restOffsetTarget, 1);
            self.life = ballon.health / ballon.healthMax;
        });
}

function updateRestOffsetTargets(ballonObjs: ObjBallon[]) {
    const radiusH = 90;
    const radiusV = 200;
    const deltaDegrees = 10;
    let i = ballonObjs.length - 1;

    for (let row = 0; row < Math.ceil(ballonObjs.length / 6); row++) {
        const remainingBallonsCount = i + 1;
        const rowBallonsCount = Math.min(remainingBallonsCount, 6 + row % 2);

        const rangeDegrees = Math.max(0, rowBallonsCount - 1) * deltaDegrees;
        const minDegrees = -rangeDegrees / 2;

        for (let rowBallonIndex = 0; rowBallonIndex < rowBallonsCount; rowBallonIndex++) {
            const ballonObj = ballonObjs[i];
            const degrees = minDegrees + deltaDegrees * rowBallonIndex + 90;
            const radians = degrees * ToRad;
            ballonObj.restOffsetTarget.at(
                Math.cos(radians) * radiusH,
                -Math.sin(radians) * radiusV + radiusV - row * 18,
            );
            i--;
        }
    }
}

type ObjBallon = ReturnType<typeof objBallon>;

export function mxnBallonable(obj: DisplayObject, { attachPoint, ballons }: MxnBallonableArgs) {
    const ballonObjs = Empty<ObjBallon>();
    const gfx = new Graphics();
    const c = container(gfx);
    let seed = Rng.intc(8_000_000, 24_000_000);

    const physicsOffset = vnew();
    const physicsOffsetSpeed = vnew();

    const previousSpeed = vnew();

    function createBallonObj(ballon: RpgStatus.Ballon, inflation: Unit) {
        const ballonObj = objBallon(ballon, inflation).show(c);
        ballonObjs.push(ballonObj);
        return ballonObj;
    }

    const rpgStatusEffects: Pick<RpgStatus.Effects, "ballonCreated" | "ballonHealthDepleted"> = {
        ballonCreated(ballon) {
            createBallonObj(ballon, 0);
        },
        ballonHealthDepleted(ballon) {
            const ballonObj = ballonObjs.find(obj => obj.ballon === ballon);
            if (ballonObj) {
                objFxBallonPop().tinted(ballonObj.tint).at(ballonObj).show();
                ballonObj.destroy();
                ballonObjs.removeFirst(ballonObj);
                // TODO pop sfx
            }
        },
    };

    let initialBallonsAlreadyApplied = false;

    function setInitialBallons(initialBallons: RpgStatus.Ballon[]) {
        if (initialBallonsAlreadyApplied) {
            Logger.logContractViolationError(
                "mxnBallonable.setInitialBallons",
                new Error("Attempted to set initial ballons after they have already been applied."),
                { ballons, initialBallons },
            );
            return;
        }

        ballons = initialBallons;
    }

    return obj
        .merge({ mxnBallonable: { attachPoint, rpgStatusEffects, setInitialBallons } })
        .coro(function* (self) {
            // TODO feels like it should actually go to primary scene stage, set an explicit z index
            c.show(self.parent).zIndexed(self.zIndex - 1);
            for (const ballon of ballons) {
                createBallonObj(ballon, 1);
            }

            updateRestOffsetTargets(ballonObjs);

            for (const ballonObj of ballonObjs) {
                ballonObj.restOffset.at(ballonObj.restOffsetTarget);
            }
            initialBallonsAlreadyApplied = true;
        })
        .coro(function* () {
            while (true) {
                seed = Rng.intc(8_000_000, 24_000_000);
                yield sleep(300);
            }
        })
        .coro(function* () {
            let previousLength = 0;
            while (true) {
                yield () => ballonObjs.length !== previousLength;
                updateRestOffsetTargets(ballonObjs);
                previousLength = ballonObjs.length;
            }
        })
        .step((self) => {
            let physicsX = 0;
            let physicsY = 0;

            if (self.is(mxnPhysics)) {
                const deltaSpeedX = self.speed.x - previousSpeed.x;
                const deltaSpeedY = self.speed.y - previousSpeed.y;

                previousSpeed.at(self.speed);

                if (self.speed.x === 0) {
                    physicsOffsetSpeed.x += physicsOffset.x * -0.05;
                }

                if (self.speed.y === 0) {
                    physicsOffsetSpeed.y += physicsOffset.y * -0.05;
                }

                physicsOffsetSpeed.add(-deltaSpeedX, -deltaSpeedY);
                physicsOffsetSpeed.scale(0.9);
                physicsOffset.add(physicsOffsetSpeed);

                physicsOffset.vlength = Math.min(physicsOffset.vlength, 10);

                physicsX = Math.round(physicsOffset.x);
                physicsY = Math.round(physicsOffset.y);
            }

            // TODO this looks like shit
            self.mxnBallonable.attachPoint.getGlobalPosition(p0);
            self.parent.getGlobalPosition(p1);
            p0.add(p1, -1);

            gfx.clear();
            gfx.lineStyle(1, 0xb0b0b0);

            prng.seed = seed;
            for (let i = 0; i < ballonObjs.length; i++) {
                const ballonObj = ballonObjs[i];
                ballonObj.at(
                    p0.x + prng.intc(-1, 1) + physicsX + Math.round(ballonObj.restOffset.x),
                    p0.y - 6 - Math.round(8 * factor.sine(ballonObj.inflation)) * 3 + prng.int(4) + physicsY
                        + Math.round(ballonObj.restOffset.y),
                );
                v.at(p0);
                gfx.moveTo(v.x, v.y);
                const length = distance(ballonObj, v);
                const step = Math.ceil(length / 3);
                for (let i = 0; i < 3; i++) {
                    v.moveTowards(ballonObj, step);
                    if (i < 2) {
                        v.x += prng.intc(-5, 5);
                    }
                    gfx.lineTo(v.x, v.y);
                }
            }
        }, StepOrder.AfterPhysics);
}
