import { Sprite } from "pixi.js";
import { Tx } from "../../../assets/textures";
import { Instances } from "../../../lib/game-engine/instances";
import { container } from "../../../lib/pixi/container";
import { RpgPocket } from "../../rpg/rpg-pocket";
import { objText } from "../../../assets/fonts";
import { mxnFxTintRotate } from "../../mixins/effects/mxn-fx-tint-rotate";
import { interpvr } from "../../../lib/game-engine/routines/interp";
import { sleep } from "../../../lib/game-engine/routines/sleep";

const [txPocket, txReset] = Tx.Ui.Pocket.CollectNotification.split({ count: 2 });

export function objPocketCollectNotification(receive: RpgPocket.ReceiveResult) {
    // TODO sfx!
    Instances(objPocketCollectNotification).forEach(x => x.destroy());
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
        .track(objPocketCollectNotification);
}
