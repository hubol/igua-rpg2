import { Graphics } from "pixi.js";
import { Input } from "../../../globals";
import { createActionRepeater } from "../../framework/action-repeater";
import { objText } from "../../../../assets/fonts";
import { UiColor } from "../../ui-color";

type ActionRepeatAdjustFactors = [ factor0: number, factor1: number, factor2: number ];

interface Restrictions {
    min?: number;
    max?: number;
}

export function objUiSliderInput(
        text: string,
        binding: { value: number },
        { min = -8, max = 8 }: Restrictions,
        [factor0, factor1, factor2]: ActionRepeatAdjustFactors = [1, 1, 1],
        width = 96,
        height = 30) {

    function getAdjustFromRepeats(repeats: number) {
        if (repeats > 10)
            return factor2;
        if (repeats > 5)
            return factor1;
        return factor0;
    }

    const g = new Graphics()
        .merge({ selected: false })
        .step(() => {
            if (!g.selected)
                return;

            if (Input.isDown('SelectLeft') && Input.isDown('SelectRight')) {
                left.reset();
                right.reset();
            }

            const value = binding.value;
            let adjust = 0;

            if (left.justWentDown)
                adjust = -getAdjustFromRepeats(left.repeats);
            else if (right.justWentDown)
                adjust = getAdjustFromRepeats(right.repeats);
            else
                return;

            binding.value = Math.max(min, Math.min(max, value + adjust));

            // TODO sfx
        })
        .step(() => {
            const value = binding.value;
            g.clear().beginFill(UiColor.Background);
            if (g.selected)
                g.lineStyle(2, UiColor.Selection, 1, 0);
            g.drawRect(0, 0, width, height);

            g.lineStyle(0);

            const length = max - min;
            const unit = (value - min) / length;

            g.beginFill(UiColor.Shadow)
                .drawRect(8, height - 12, width - 16, 4)
                .beginFill(UiColor.Text)
                .drawRect(8, height - 12, (width - 16) * unit, 4);
        });

    const left = createActionRepeater(g, 'SelectLeft');
    const right = createActionRepeater(g, 'SelectRight');

    const font = objText.Large(text).at(width / 2, 6);
    font.anchor.set(0.5, 0);
    g.addChild(font);
    return g;
}
