import { Sprite } from "pixi.js";
import { Tx } from "../../../../assets/textures";
import { sleep } from "../../../../lib/game-engine/routines/sleep";
import { container } from "../../../../lib/pixi/container";
import { mxnSinePivot } from "../../../mixins/mxn-sine-pivot";
import { objIndexedSprite } from "../../utils/obj-indexed-sprite";

const txs = {
    body: Tx.Casino.Lewd.Jo.Body,
    head: Tx.Casino.Lewd.Jo.Head,
    torso: Tx.Casino.Lewd.Jo.Torso.split({ count: 2 }),
};

export function objCasinoLewdJo() {
    return container(
        Sprite.from(txs.body),
        objIndexedSprite(txs.torso)
            .coro(function* (self) {
                while (true) {
                    yield sleep(200);
                    self.textureIndex = self.textureIndex === 1 ? 0 : 1;
                }
            })
            .at(40, 14),
        Sprite.from(txs.head)
            .mixin(mxnSinePivot)
            .at(27, -61),
    );
}
