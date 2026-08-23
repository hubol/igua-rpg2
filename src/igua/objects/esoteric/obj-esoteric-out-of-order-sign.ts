import { Sprite } from "pixi.js";
import { Sfx } from "../../../assets/sounds";
import { Tx } from "../../../assets/textures";
import { show } from "../../drama/show";
import { mxnCutscene } from "../../mixins/mxn-cutscene";
import { mxnSpeaker } from "../../mixins/mxn-speaker";

export function objEsotericOutOfOrderSign() {
    const api = {
        isActive: true,
    };

    return Sprite.from(Tx.Esoteric.OutOfOrderSign)
        .anchored(0.5, 0.5)
        .track(objEsotericOutOfOrderSign)
        .identify(objEsotericOutOfOrderSign)
        .mixin(mxnSpeaker, { name: "Out of Order sign", tintPrimary: 0xDB3A32, tintSecondary: 0xffffff })
        .handles("mxnSpeaker.speakingStarted", () => Sfx.Interact.Error.rate(0.9, 1.1).play())
        .mixin(mxnCutscene, function* () {
            yield* show("It's out of order.");
        })
        .merge({ objEsotericOutOfOrderSign: api })
        .step(self => self.interact.enabled = self.visible = api.isActive);
}
