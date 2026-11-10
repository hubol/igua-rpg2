import { BLEND_MODES, Sprite } from "pixi.js";
import { Tx } from "../../../assets/textures";
import { factor, interp } from "../../../lib/game-engine/routines/interp";
import { sleep } from "../../../lib/game-engine/routines/sleep";
import { container } from "../../../lib/pixi/container";
import { ZIndex } from "../../core/scene/z-index";
import { mxnComputer } from "../../mixins/mxn-computer";
import { mxnSpeaker } from "../../mixins/mxn-speaker";
import { StepOrder } from "../step-order";

const txs = Tx.Furniture.ComputerIbm.split({ count: 2 });

export function objCharacterComputerIbm() {
    const api = {
        on: false,
    };

    return container(
        Sprite.from(txs[0]),
        Sprite.from(txs[1])
            .coro(function* (self) {
                self.alpha = 0;
                self.blendMode = BLEND_MODES.ADD;
                while (true) {
                    yield () => api.on;
                    yield interp(self, "alpha").factor(factor.sine).to(0.9).over(100);
                    yield sleep(400);
                    yield interp(self, "alpha").factor(factor.sine).to(0).over(300);
                    yield sleep(200);
                }
            }, StepOrder.BeforeCamera),
    )
        .pivoted(21, 50)
        .mixin(mxnSpeaker, { name: "Personal Computer", tintPrimary: 0x00ff00, tintSecondary: 0x000000 })
        .mixin(mxnComputer)
        .merge({ objCharacterComputerIbm: api })
        .zIndexed(ZIndex.CharacterEntities);
}
