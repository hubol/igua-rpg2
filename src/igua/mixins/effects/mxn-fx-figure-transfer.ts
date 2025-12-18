import { Container, DisplayObject } from "pixi.js";
import { Coro } from "../../../lib/game-engine/routines/coro";
import { factor, interpv, interpvr } from "../../../lib/game-engine/routines/interp";
import { sleepf } from "../../../lib/game-engine/routines/sleep";
import { Rng } from "../../../lib/math/rng";
import { VectorSimple, vnew } from "../../../lib/math/vector-type";
import { container } from "../../../lib/pixi/container";

interface MxnFxFigureTransferArgs {
    speed?: VectorSimple;
    gravity?: number;
    targetObj: DisplayObject | null;
}

export function mxnFxFigureTransfer(
    obj: Container,
    {
        speed = vnew(Rng.float(-1, 1), Rng.float(-2.5, -3.5)),
        gravity = Rng.float(0.1, 0.15),
        targetObj,
    }: MxnFxFigureTransferArgs,
) {
    let angle = 0;

    return obj
        .pivotedUnit(0.5, 0.5)
        .scaled(0, 0)
        .dispatches<"mxnFigureTransfer:transfered">()
        .coro(function* (self) {
            yield* Coro.all([
                interpv(self.scale).steps(3).to(1, 1).over(100),
                interpvr(self).factor(factor.sine).translate(0, -6).over(100),
            ]);

            const motionObj = container()
                .step(() => {
                    self.add(speed);
                    speed.y += gravity;

                    angle += speed.x * 4 + Math.sign(speed.x) * 2;
                    self.angle = Math.round(angle / 90) * 90;
                })
                .show(self);

            yield () => speed.y >= 0;

            if (targetObj) {
                motionObj.destroy();

                yield sleepf(10);

                yield* Coro.race([
                    () => targetObj.destroyed,
                    Coro.chain([sleepf(10), () => targetObj.collides(self)]),
                    interpvr(self).factor(factor.sine).to(targetObj.getWorldCenter()).over(300),
                ]);
            }
            else {
                yield sleepf(90);
                motionObj.destroy();
            }

            self.dispatch("mxnFigureTransfer:transfered");
        });
}

export type MxnFxFigureTransfer = ReturnType<typeof mxnFxFigureTransfer>;
