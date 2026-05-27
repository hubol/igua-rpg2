import { Sprite } from "pixi.js";
import { Tx } from "../../../assets/textures";
import { sleep } from "../../../lib/game-engine/routines/sleep";
import { Rng } from "../../../lib/math/rng";
import { container } from "../../../lib/pixi/container";
import { objIndexedSprite } from "../utils/obj-indexed-sprite";

const [
    txSticks,
    txSmoke0,
    txSmoke1,
    txSmoke2,
    txFlame0,
    txFlame1,
    txFlame2,
] = Tx.Esoteric.Decoration.Campfire.split({ width: 164 });

const txsSmoke = [
    txSmoke0,
    txSmoke1,
    txSmoke2,
];

const txsFlame = [
    txFlame0,
    txFlame1,
    txFlame2,
];

export function objEsotericDecorationCampfire() {
    const smokeObj = objIndexedSprite(txsSmoke);
    const flameObj = objIndexedSprite(txsFlame);

    const animatedObjs = [smokeObj, flameObj];

    return container(
        Sprite.from(txSticks),
        smokeObj,
        flameObj,
    )
        .coro(function* () {
            while (true) {
                for (const obj of animatedObjs) {
                    obj.at(Rng.intc(-1, 1), Rng.intc(-1, 1));
                    obj.textureIndex = Rng.int(obj.textures.length);
                }
                yield sleep(Rng.intc(300, 400));
            }
        })
        .pivoted(12, 147);
}
