import { Sprite } from "pixi.js";
import { Tx } from "../../assets/textures";
import { interp } from "../../lib/game-engine/routines/interp";
import { sleep } from "../../lib/game-engine/routines/sleep";
import { Rng } from "../../lib/math/rng";
import { container } from "../../lib/pixi/container";
import { objIndexedSprite } from "./utils/obj-indexed-sprite";

const [txDisk, ...txsShine] = Tx.Ui.FloppyDisk.split({ width: 18 });

export function objFloppyDisk() {
    return container(
        Sprite.from(txDisk),
        objIndexedSprite(txsShine)
            .coro(function* (self) {
                self.alpha = 0.5;
                while (true) {
                    self.visible = false;
                    self.textureIndex = 0;
                    yield sleep(Rng.int(400, 1000));
                    self.visible = true;
                    yield interp(self, "textureIndex").to(txsShine.length).over(Rng.int(250, 400));
                }
            }),
    );
}
