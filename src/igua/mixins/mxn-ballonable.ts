import { DisplayObject, Graphics, Point } from "pixi.js";
import { factor } from "../../lib/game-engine/routines/interp";
import { sleep } from "../../lib/game-engine/routines/sleep";
import { approachLinear } from "../../lib/math/number";
import { PseudoRng, Rng } from "../../lib/math/rng";
import { distance, vequals } from "../../lib/math/vector";
import { vnew } from "../../lib/math/vector-type";
import { container } from "../../lib/pixi/container";
import { Empty } from "../../lib/types/empty";
import { ObjFxBallon, objFxBallon } from "../objects/effects/obj-fx-ballon";
import { StepOrder } from "../objects/step-order";
import { mxnPhysics } from "./mxn-physics";

interface MxnBallonableArgs {
    attachPoint: DisplayObject;
}

const p0 = new Point();
const p1 = new Point();
const prng = new PseudoRng();
const v = vnew();

export function mxnBallonable(obj: DisplayObject, { attachPoint }: MxnBallonableArgs) {
    const fxBallonObjs = Empty<ObjFxBallon>();
    const gfx = new Graphics();
    const c = container(gfx);
    let seed = Rng.intc(8_000_000, 24_000_000);

    const physicsOffset = vnew();
    const physicsOffsetSpeed = vnew();

    const previousSpeed = vnew();

    return obj
        .merge({ mxnBallonable: { attachPoint } })
        .coro(function* (self) {
            c.show(self.parent).zIndexed(self.zIndex - 1);
            fxBallonObjs.push(objFxBallon().show(c));
        })
        .coro(function* () {
            while (true) {
                seed = Rng.intc(8_000_000, 24_000_000);
                yield sleep(300);
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
            for (let i = 0; i < fxBallonObjs.length; i++) {
                const ballonObj = fxBallonObjs[i];
                ballonObj.at(
                    p0.x + prng.intc(-1, 1) + physicsX,
                    p0.y - 6 - Math.round(8 * factor.sine(ballonObj.inflation)) * 3 - i * 30 + prng.int(4) + physicsY,
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
