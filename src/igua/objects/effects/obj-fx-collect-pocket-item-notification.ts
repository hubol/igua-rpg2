import { Sprite } from "pixi.js";
import { objText } from "../../../assets/fonts";
import { Sfx } from "../../../assets/sounds";
import { Tx } from "../../../assets/textures";
import { Instances } from "../../../lib/game-engine/instances";
import { interpvr } from "../../../lib/game-engine/routines/interp";
import { sleep } from "../../../lib/game-engine/routines/sleep";
import { container } from "../../../lib/pixi/container";
import { mxnFxTintRotate } from "../../mixins/effects/mxn-fx-tint-rotate";
import { RpgPocket } from "../../rpg/rpg-pocket";

const [txPocket, txReset] = Tx.Ui.Pocket.CollectNotification.split({ count: 2 });

export function objFxCollectPocketItemNotification(receive: RpgPocket.ReceiveResult) {
    if (receive.reset) {
        Sfx.Collect.PocketReset.play();
    }
    else {
        Sfx.Collect.PocketIncrease.rate(1 + (receive.count - 1) * 0.05).play();
    }
    Instances(objFxCollectPocketItemNotification).forEach(x => x.destroy());
    return container(
        Sprite.from(txPocket).tinted(0x00ff00),
        receive.reset
            ? Sprite.from(txReset).mixin(mxnFxTintRotate)
            : objText.Medium("x" + receive.count, { tint: 0x00ff00 }).anchored(0.5, 0.5).at(20, 20),
    )
        .pivoted(20, 14)
        .coro(function* (self) {
            yield interpvr(self).translate(0, -8).over(100);
            yield sleep(900);
            self.destroy();
        })
        .track(objFxCollectPocketItemNotification);
}
