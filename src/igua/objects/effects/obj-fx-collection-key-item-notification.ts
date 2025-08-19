import { Sprite } from "pixi.js";
import { objText } from "../../../assets/fonts";
import { Sfx } from "../../../assets/sounds";
import { Tx } from "../../../assets/textures";
import { Instances } from "../../../lib/game-engine/instances";
import { factor, interpv, interpvr } from "../../../lib/game-engine/routines/interp";
import { sleep } from "../../../lib/game-engine/routines/sleep";
import { container } from "../../../lib/pixi/container";
import { DataKeyItem } from "../../data/data-key-item";
import { mxnFxTintRotate } from "../../mixins/effects/mxn-fx-tint-rotate";
import { mxnBoilPivot } from "../../mixins/mxn-boil-pivot";
import { mxnTextTyped } from "../../mixins/mxn-text-typed";
import { Rpg } from "../../rpg/rpg";

const [headingTx, subheadingTx] = Tx.Effects.KeyItemNotification.split({ count: 2 });

export function objFxCollectKeyItemNotification(keyItemId: DataKeyItem.Id) {
    Instances(objFxCollectKeyItemNotification).forEach(obj => {
        if (obj.keyItemId === keyItemId) {
            obj.destroy();
        }
    });

    return container(
        Sprite.from(headingTx),
    )
        .merge({ keyItemId })
        .pivoted(42, 10)
        .coro(function* (self) {
            yield interpvr(self.pivot).factor(factor.sine).translate(0, 32).over(300);
        })
        .coro(function* (self) {
            yield sleep(300);
            Sprite.from(subheadingTx).show(self);
            yield sleep(300);
            const textObj = objText.MediumBoldIrregular("" + Rpg.inventory.keyItems.count(keyItemId), {
                tint: 0x2048AD,
            })
                .anchored(0.5, 0.5)
                .at(69, 18)
                .scaled(6, 6)
                .show(self);

            yield interpvr(textObj.scale).factor(factor.sine).to(1, 1).over(400);
            textObj.mixin(mxnBoilPivot);
            yield sleep(700);
            self.destroy();
        })
        .track(objFxCollectKeyItemNotification);
}
