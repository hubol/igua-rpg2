import { Graphics } from "pixi.js";
import { objText } from "../../../assets/fonts";
import { Integer, RgbInt } from "../../../lib/math/number-alias-types";
import { container } from "../../../lib/pixi/container";

interface ObjDramaOwnedCountArgs {
    count: Integer;
    bgTint: RgbInt;
    fgTint: RgbInt;
    visibleWhenZero: boolean;
}

export function objDramaOwnedCount(args: ObjDramaOwnedCountArgs) {
    let count = args.count;

    const controls = {
        get count() {
            return count;
        },
        set count(value) {
            count = value;
            update();
        },
    };

    const textObj = objText.SmallDigits("", { tint: args.fgTint });
    const gfx = new Graphics();

    const obj = container(gfx, textObj);

    function update() {
        textObj.text = count === 1 ? "OWNED" : `${count} OWNED`;
        gfx.clear().beginFill(args.bgTint).drawRect(
            -1,
            -1,
            textObj.width + 2,
            textObj.height + 2,
        );
        obj.visible = args.visibleWhenZero || count > 0;
    }

    update();

    return obj.merge({ controls });
}
