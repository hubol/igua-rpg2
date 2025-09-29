import { sleep } from "../../lib/game-engine/routines/sleep";
import { Rng } from "../../lib/math/rng";
import { ObjIndexedSprite } from "../objects/utils/obj-indexed-sprite";

export function mxnBoilTextureIndex(obj: ObjIndexedSprite) {
    return obj
        .coro(function* () {
            while (true) {
                obj.textureIndex = Rng.int(obj.textures.length);
                yield sleep(Rng.intc(100, 300));
            }
        });
}
