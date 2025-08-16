import { objText } from "../../../assets/fonts";
import { Sfx } from "../../../assets/sounds";
import { Instances } from "../../../lib/game-engine/instances";
import { sleep } from "../../../lib/game-engine/routines/sleep";
import { container } from "../../../lib/pixi/container";
import { mxnFxTintRotate } from "../../mixins/effects/mxn-fx-tint-rotate";
import { mxnTextTyped } from "../../mixins/mxn-text-typed";
import { Rpg } from "../../rpg/rpg";

export function objFxCollectPotionNotification() {
    Instances(objFxCollectPotionNotification).forEach(x => x.destroy());

    const typedTextObj = objText.MediumIrregular("", { tint: 0x00ff00 })
        .anchored(0, 1)
        .mixin(mxnTextTyped, () => "You have");

    return container(
        typedTextObj.at(-22, 0),
    )
        .pivoted(0, 16)
        .coro(function* (self) {
            yield sleep(300);
            const length = Rpg.inventory.potions.length;
            objText.MediumBoldIrregular(length + (length === 1 ? " food" : " foods"))
                .mixin(mxnFxTintRotate)
                .anchored(0.5, 0)
                .show(self);

            yield sleep(750);
            for (let i = 0; i < 10; i++) {
                self.play(Sfx.Effect.PotionNotificationTwitch.rate(0.5, 2));
                self.pivot.x = (i + 1) * (i % 2 === 0 ? 1 : -1);
                yield sleep(70);
            }
            self.destroy();
        })
        .track(objFxCollectPotionNotification);
}
