import { Graphics, Sprite } from "pixi.js";
import { Tx } from "../../../assets/textures";
import { Integer } from "../../../lib/math/number-alias-types";
import { container } from "../../../lib/pixi/container";
import { range } from "../../../lib/range";

interface ObjUiAcceptableRangeArgs {
    max: Integer;
    range: {
        /** Implement as getter */
        min: Integer;
        /** Implement as getter */
        max: Integer;
    };
    width: Integer;
    height: Integer;
    /** Implement as getter */
    value: Integer | null;
}

export function objUiAcceptableRange(args: ObjUiAcceptableRangeArgs) {
    const api = {
        get isValueInRange() {
            return args.value !== null && args.value >= args.range.min && args.value <= args.range.max;
        },
    };

    const rangeObj = new Graphics();
    const valueObj = new Graphics();

    return container(
        new Graphics().beginFill(0xffffff).drawRect(0, 0, args.width, args.height),
        rangeObj,
        valueObj,
        Sprite.from(Tx.Ui.Checkmark)
            .tinted(0x00ff00)
            .pivoted(1, 8)
            .at(args.width + 2, Math.round(args.height / 2))
            .invisible()
            .step(self => self.visible = api.isValueInRange),
    )
        .merge({ objUiAcceptableRange: api })
        .step(() => {
            const x0 = Math.round(Math.max(0, Math.min(args.range.min / args.max, 1)) * args.width);
            const x1 = Math.round(Math.max(0, Math.min(args.range.max / args.max, 1)) * args.width);
            rangeObj
                .clear()
                .beginFill(0xbbbbbb)
                .drawRect(x0, -1, x1 - x0, args.height + 2);

            valueObj.clear();

            if (args.value === null) {
                return;
            }

            let x = Math.round(Math.max(0, Math.min(args.value / args.max, 1)) * args.width);
            if (args.value < args.range.min && x >= x0) {
                x = x0 - 1;
            }
            if (args.value > args.range.max && x < x1) {
                x = x1;
            }

            valueObj
                .beginFill(0x000000)
                .drawRect(x, 0, 1, args.height);
        });
}
