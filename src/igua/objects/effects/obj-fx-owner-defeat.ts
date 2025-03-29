import { Sprite } from "pixi.js";
import { Tx } from "../../../assets/textures";
import { Coro } from "../../../lib/game-engine/routines/coro";
import { interpc, interpvr } from "../../../lib/game-engine/routines/interp";
import { container } from "../../../lib/pixi/container";
import { objFxBurstDusty } from "./obj-fx-burst-dusty";

export function objFxOwnerDefeat() {
    return container(
        objFxBurstDusty(),
        Sprite.from(Tx.Ui.OwnerDefeat)
            .anchored(0.5, 0.5)
            .coro(function* (self) {
                self.tint = 0x802000;
                yield* Coro.all([
                    interpc(self, "tint").steps(4).to(0xe8a828).over(1500),
                    interpvr(self).translate(0, -8).over(500),
                ]);
                self.destroy();
            }),
    )
        .coro(function* (self) {
            yield () => self.children.length === 0;
        });
}
