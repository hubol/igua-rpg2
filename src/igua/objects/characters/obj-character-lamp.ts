import { Sprite } from "pixi.js";
import { Tx } from "../../../assets/textures";
import { sleep } from "../../../lib/game-engine/routines/sleep";
import { Rng } from "../../../lib/math/rng";
import { container } from "../../../lib/pixi/container";
import { mxnDetectPlayer } from "../../mixins/mxn-detect-player";
import { mxnFacingPivot } from "../../mixins/mxn-facing-pivot";
import { mxnRpgAttack } from "../../mixins/mxn-rpg-attack";
import { RpgAttack } from "../../rpg/rpg-attack";
import { objIndexedSprite } from "../utils/obj-indexed-sprite";

const [
    txBody0,
    txBody1,
    txFace,
    txCage,
] = Tx.Characters.Lamp.Layers.split({ width: 70 });

const atks = {
    aura: RpgAttack.create({
        conditions: {
            overheat: {
                value: 1,
                damage: 20,
            },
        },
    }),
};

export function objCharacterLamp() {
    return container(
        objIndexedSprite([txBody0, txBody1])
            .anchored(0.5, 0.5)
            .coro(function* (self) {
                while (true) {
                    const x = Rng.int(3);
                    if (x === 0) {
                        self.scale.x *= -1;
                    }
                    if (x === 1) {
                        self.scale.y *= -1;
                    }
                    if (x === 2) {
                        self.textureIndex = 1 - self.textureIndex;
                    }
                    yield sleep(250);
                }
            })
            .at(0, 8),
        Sprite.from(txFace)
            .mixin(mxnFacingPivot, { left: -4, right: 4, up: 0, down: 0 })
            .anchored(0.5, 0.5),
        Sprite.from(txCage)
            .anchored(0.5, 0.5),
    )
        .mixin(mxnDetectPlayer)
        .mixin(mxnRpgAttack, { attack: atks.aura });
}
