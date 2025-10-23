import { Sprite } from "pixi.js";
import { Sfx } from "../../../assets/sounds";
import { Tx } from "../../../assets/textures";
import { blendColor } from "../../../lib/color/blend-color";
import { factor, interp, interpvr } from "../../../lib/game-engine/routines/interp";
import { sleep } from "../../../lib/game-engine/routines/sleep";
import { Rng } from "../../../lib/math/rng";
import { mxnMotion } from "../../mixins/mxn-motion";
import { mxnSparkling } from "../../mixins/mxn-sparkling";
import { objDieOnEmpty } from "../utils/obj-die-on-empty";
import { FxPattern } from "./lib/fx-pattern";
import { objFxAsterisk16Px } from "./obj-fx-asterisk-16px";

export function objFxCollectEquipmentNotification() {
    return Sprite.from(Tx.Effects.EquipmentNotification)
        .anchored(0.5, 0.5)
        .mixin(mxnSparkling)
        .coro(function* (self) {
            self.play(Sfx.Collect.Equipment.rate(0.95, 1.05));
            objFxEquipmentCollectBurst().at(self).show();
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

function objFxEquipmentCollectBurst() {
    const obj = objDieOnEmpty();

    for (const { position, normal } of FxPattern.getRadialBurst({ count: 6, radius: [6, 12] })) {
        objFxAsterisk16Px()
            .tinted(blendColor(0xE5BB00, 0xecd364, Rng.float()))
            .mixin(mxnMotion)
            .step(self => self.speed.scale(0.97))
            .at(position)
            .show(obj)
            .speed.at(normal, Rng.float(1.2, 1.9));
    }

    return obj;
}
