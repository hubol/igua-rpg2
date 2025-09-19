import { Graphics } from "pixi.js";
import { objText } from "../../../assets/fonts";
import { Integer, RgbInt } from "../../../lib/math/number-alias-types";
import { container } from "../../../lib/pixi/container";

interface ObjUiDeltaArgs {
    valueProvider: () => Integer;
    bgPositiveTint: RgbInt;
    bgNegativeTint: RgbInt;
    fgTint: RgbInt;
}

export function objUiDelta({ valueProvider, bgNegativeTint, bgPositiveTint, fgTint }: ObjUiDeltaArgs) {
    let previousValue = valueProvider();
    let nextValue = previousValue;
    let visibleForStepsCount = 0;

    const bg = new Graphics();
    const textObj = objText.Medium("", { tint: fgTint });

    return container(bg, textObj)
        .invisible()
        .step(self => {
            visibleForStepsCount--;
            const wasVisible = self.visible;
            self.visible = visibleForStepsCount > 0;
            if (wasVisible && !self.visible) {
                previousValue = nextValue;
            }
        })
        .coro(function* () {
            while (true) {
                yield () => nextValue !== valueProvider();
                nextValue = valueProvider();
                visibleForStepsCount = 120;
                const delta = nextValue - previousValue;
                textObj.text = (delta > 0 ? "+" : "") + delta;
                const bgTint = delta < 0 ? bgNegativeTint : bgPositiveTint;

                const bounds = textObj.getLocalBounds();

                bg
                    .clear()
                    .lineStyle({ color: bgTint, width: 2, alignment: 1 })
                    .beginFill(bgTint)
                    .drawRect(bounds.x, bounds.y, bounds.width, bounds.height);
            }
        });
}
