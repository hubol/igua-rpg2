import { Sprite } from "pixi.js";
import { Sfx } from "../../../assets/sounds";
import { Tx } from "../../../assets/textures";
import { interpc } from "../../../lib/game-engine/routines/interp";
import { show } from "../../drama/show";
import { Input, layers, scene } from "../../globals";
import { mxnCutscene } from "../../mixins/mxn-cutscene";
import { mxnHudModifiers } from "../../mixins/mxn-hud-modifiers";
import { mxnInputDirectionVector } from "../../mixins/mxn-input-direction-vector";
import { mxnSpeaker } from "../../mixins/mxn-speaker";

export function objEsotericBinocularViewer() {
    return Sprite.from(Tx.Esoteric.BinocularViewer)
        .pivoted(24, 35)
        .mixin(mxnSpeaker, { name: "Binocular Viewer", tintPrimary: 0xDB5D1E, tintSecondary: 0xDBA31E })
        .handles("mxnSpeaker.speakingStarted", () => Sfx.Interact.BinocularsStart.rate(0.99, 1.01).play())
        .handles("mxnSpeaker.speakingEnded", () => Sfx.Interact.BinocularsEnd.rate(0.99, 1.01).play())
        .mixin(mxnCutscene, function* () {
            yield* show("Please enjoy the world.");

            scene.camera.mode = "controlled";

            const controllerObj = Sprite.from(Tx.Ui.BinocularCameraControls)
                .mixin(mxnHudModifiers.mxnHideStatus)
                .mixin(mxnInputDirectionVector)
                .step(self => scene.camera.add(self.mxnInputDirectionVector.current, 6))
                .tinted(0xDBA31E)
                .coro(function* (self) {
                    while (true) {
                        yield interpc(self, "tint").steps(4).to(0xDB5D1E).over(666);
                        yield interpc(self, "tint").steps(4).to(0xDBA31E).over(666);
                    }
                })
                .at(0, -12)
                .show(layers.overlay.messages);

            yield () => Input.isUp("Confirm");
            yield () => Input.justWentDown("Confirm");

            controllerObj.destroy();
            yield scene.camera.auto.panToPlayer();

            yield* show("Thank you for enjoying the world.");
        });
}
