import { Graphics, Sprite } from "pixi.js";
import { Tx } from "../../../assets/textures";
import { container } from "../../../lib/pixi/container";

export function objUiSpellsPower() {
    const frontMaskObj = new Graphics()
        .beginFill(0xff0000)
        .drawRect(0, -1, 20, 1)
        .scaled(1, 0)
        .at(0, 14);

    let fillUnit = 0;

    const api = {
        get fillUnit() {
            return fillUnit;
        },
        set fillUnit(value) {
            if (fillUnit === value) {
                return;
            }

            frontMaskObj.scale.y = Math.round(Math.max(0, Math.min(1, fillUnit)) * 14);
            fillUnit = value;
        },
    };

    return container(
        frontMaskObj,
        Sprite.from(Tx.Ui.SpellsPowerBack),
        Sprite.from(Tx.Ui.SpellsPowerFront)
            .masked(frontMaskObj),
    )
        .merge({ objUiSpellsPower: api });
}
