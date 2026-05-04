import { TilingSprite } from "pixi.js";
import { NoAtlasTx } from "../../../assets/no-atlas-textures";
import { Integer } from "../../../lib/math/number-alias-types";
import { container } from "../../../lib/pixi/container";

const consts = {
    padding: 20,
};

export function objFxCrackedEarth(width: Integer) {
    let appliedTint = 0xffffff;
    let appliedWidth = -1;

    const leftObj = new TilingSprite(NoAtlasTx.Effects.CrackedEarth, 0, 16);
    const centerObj = new TilingSprite(NoAtlasTx.Effects.CrackedEarth, 0, 16);
    const rightObj = new TilingSprite(NoAtlasTx.Effects.CrackedEarth, 0, 16);

    leftObj.alpha = 0.5;
    rightObj.alpha = 0.5;

    const api = {
        get tint() {
            return appliedTint;
        },
        set tint(value) {
            if (appliedTint === value) {
                return;
            }

            leftObj.tint = value;
            rightObj.tint = value;
            centerObj.tint = value;

            appliedTint = value;
        },
        get width() {
            return appliedWidth;
        },
        set width(value) {
            if (appliedWidth === value) {
                return;
            }

            const centerWidth = Math.floor(Math.max(0, value - consts.padding));
            const remainingWidth = value - centerWidth;
            const leftWidth = Math.floor(remainingWidth / 2);
            const rightWidth = Math.ceil(remainingWidth / 2);

            leftObj.width = leftWidth;
            centerObj.width = centerWidth;
            rightObj.width = rightWidth;

            centerObj.x = leftWidth;
            rightObj.x = leftWidth + centerWidth;

            leftObj.tilePosition.x = leftWidth + 48;
            centerObj.tilePosition.x = 0 + 48;
            rightObj.tilePosition.x = -centerWidth + 48;

            appliedWidth = value;
        },
    };

    api.width = width;

    return container(
        leftObj,
        centerObj,
        rightObj,
    )
        .merge({ objFxCrackedEarth: api });
}
