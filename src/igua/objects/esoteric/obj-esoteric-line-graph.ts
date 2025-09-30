import { Graphics } from "pixi.js";
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
        });

    return container(
        new Graphics().beginFill(0x000000).drawRect(0, 0, width, height),
        rangeGfx,
    )
        .merge({ objEsotericLineGraph: { controls, min, max } });
}
