import { Sprite } from "pixi.js";
import { Tx } from "../../../assets/textures";
import { interp, interpv } from "../../../lib/game-engine/routines/interp";
import { sleepf } from "../../../lib/game-engine/routines/sleep";
import { Rng } from "../../../lib/math/rng";
import { container } from "../../../lib/pixi/container";
import { objIndexedSprite } from "../utils/obj-indexed-sprite";

const txsLayers = Tx.Characters.Firefly.Layers.split({ width: 24 });

const txsFire = txsLayers.slice(0, 3);
const txsFly = txsLayers.slice(3);

export function objCharacterFirefly() {
    const fireObj = objIndexedSprite(txsFire)
        .pivoted(12, 34)
        .scaled(0, 0);

    const flyObj = objIndexedSprite(txsFly)
        .pivoted(12, 34);

    return container(
        fireObj,
        flyObj,
    )
        .coro(function* () {
            yield interpv(fireObj.scale).steps(3).to(1, 1).over(500);
        })
        .coro(function* () {
            const indices = [0, 1, 2, 1];
            while (true) {
                for (const index of indices) {
                    fireObj.textureIndex = Rng.float(txsLayers.length);
                    if (Rng.bool()) {
                        fireObj.scale.x *= -1;
                    }
                    fireObj.at(Rng.intc(-1, 1), Rng.intc(-1, 1));
                    flyObj.textureIndex = index;
                    yield sleepf(7);
                }
            }
        });
}
