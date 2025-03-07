import { DisplayObject, Graphics, Point } from "pixi.js";
import { factor } from "../../lib/game-engine/routines/interp";
import { sleep } from "../../lib/game-engine/routines/sleep";
import { PseudoRng, Rng } from "../../lib/math/rng";
import { distance } from "../../lib/math/vector";
import { vnew } from "../../lib/math/vector-type";
import { container } from "../../lib/pixi/container";
import { Empty } from "../../lib/types/empty";
import { ObjFxBallon, objFxBallon } from "../objects/effects/obj-fx-ballon";
import { StepOrder } from "../objects/step-order";

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
                    p0.x + prng.intc(-1, 1),
                    p0.y - 6 - Math.round(8 * factor.sine(ballonObj.inflation)) * 3 - i * 30 + prng.int(4),
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
