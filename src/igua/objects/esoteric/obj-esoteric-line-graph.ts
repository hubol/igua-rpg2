import { Graphics } from "pixi.js";
import { objText } from "../../../assets/fonts";
import { onMutate } from "../../../lib/game-engine/routines/on-mutate";
import { approachLinear } from "../../../lib/math/number";
import { Integer } from "../../../lib/math/number-alias-types";
import { container } from "../../../lib/pixi/container";

interface ObjEsotericLineGraphArgs {
    min: Integer;
    max: Integer;
    width: Integer;
    height: Integer;
}

export function objEsotericLineGraph({ min, max, width, height }: ObjEsotericLineGraphArgs) {
    const controls = {
        range: {
            start: min,
            end: max,
        },
    };

    const rangeRender = {
        start: 0,
        end: width,
    };

    const targetRender = {
        start: 0,
        end: width,
    };

    const textObjs = {
        start: objText.Medium(String(min)).anchored(0.5, 1),
        end: objText.Medium(String(min)).anchored(0.5, 1),
    };

    const range = max - min;

    const rangeGfx = new Graphics()
        .coro(function* () {
            while (true) {
                const sf = (controls.range.start - min) / range;
                const ef = (controls.range.end - min) / range;

                targetRender.start = Math.max(sf > 0 ? 1 : 0, Math.min(width - 1, Math.round(sf * width)));
                targetRender.end = Math.max(1, Math.min(ef < 1 ? (width - 1) : width, Math.round(ef * width)));

                yield onMutate(controls.range);
            }
        })
        .step(self => {
            rangeRender.start = approachLinear(rangeRender.start, targetRender.start, 1);
            rangeRender.end = approachLinear(rangeRender.end, targetRender.end, 1);

            self.clear().beginFill(0xff0000).drawRect(
                rangeRender.start,
                0,
                rangeRender.end - rangeRender.start,
                height,
            );
        })
        .coro(function* () {
            while (true) {
                textObjs.start.at(rangeRender.start, 0).text = String(rangeRender.start);
                textObjs.end.at(rangeRender.end, 0).text = String(rangeRender.end);

                const gap = Math.round((textObjs.start.width + textObjs.end.width) / 2) + 4;

                let shiftStart = true;

                while ((textObjs.end.x - textObjs.start.x) < gap) {
                    if (shiftStart) {
                        textObjs.start.x -= 1;
                    }
                    else {
                        textObjs.end.x += 1;
                    }
                    shiftStart = !shiftStart;
                }

                yield onMutate(rangeRender);
            }
        });

    return container(
        new Graphics().beginFill(0x000000).drawRect(0, 0, width, height),
        rangeGfx,
        textObjs.start,
        textObjs.end,
    )
        .merge({ objEsotericLineGraph: { controls, min, max } });
}
