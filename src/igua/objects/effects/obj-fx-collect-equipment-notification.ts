import { Sprite } from "pixi.js";
import { Tx } from "../../../assets/textures";
import { factor, interp, interpvr } from "../../../lib/game-engine/routines/interp";
import { sleep } from "../../../lib/game-engine/routines/sleep";
import { mxnSparkling } from "../../mixins/mxn-sparkling";

export function objFxCollectEquipmentNotification() {
    return Sprite.from(Tx.Effects.EquipmentNotification)
        .anchored(0.5, 0.5)
        .mixin(mxnSparkling)
        .coro(function* (self) {
            yield interpvr(self.pivot).factor(factor.sine).to(0, 24).over(250);
            self.sparklesTint = 0xE5BB00;
            yield interp(self, "sparklesPerFrame").to(0.3).over(350);
            yield sleep(400);
            self.alpha = 0.5;
            self.sparklesPerFrame = 0.05;
            yield sleep(150);
            self.destroy();
        });
}
