import { Tx } from "../../../assets/textures";
import { interp } from "../../../lib/game-engine/routines/interp";
import { sleep } from "../../../lib/game-engine/routines/sleep";
import { Integer } from "../../../lib/math/number-alias-types";
import { Rng } from "../../../lib/math/rng";
import { vnew } from "../../../lib/math/vector-type";
import { container } from "../../../lib/pixi/container";
import { objIndexedSprite } from "../utils/obj-indexed-sprite";

const txAura = Tx.Effects.EmoAura24px.split({ width: 24 });
const txsAuraDispel = Tx.Effects.EmoAuraDispel24px.split({ width: 66 });

export function objFxEmoAura24px() {
    const position = vnew();

    return container()
        .step(self => position.at(self.getWorldPosition()))
        .coro(function* (self) {
            const formObj = objDispel(txsAuraDispel.length).show(self);
            yield interp(formObj, "textureIndex").to(0).over(333);

            const destroyObj = container()
                .coro(function* () {
                    yield () => self.destroyed;
                    destroyObj.at(position);
                    const dispelObj = objDispel(0);
                    dispelObj.show(destroyObj);
                    yield interp(dispelObj, "textureIndex").to(txsAuraDispel.length).over(500);
                    destroyObj.destroy();
                })
                .show();

            formObj.destroy();
            objIndexedSprite(txAura)
                .anchored(0.5, 0.5)
                .coro(function* (self) {
                    while (true) {
                        self.angle = Rng.int(4) * 90;
                        self.scale.x = Rng.intp();
                        self.scale.y = Rng.intp();
                        self.textureIndex = Rng.int(self.textures.length);
                        yield sleep(150);
                    }
                })
                .show(self);
        });
}

function objDispel(textureIndex: Integer) {
    return objIndexedSprite(txsAuraDispel, textureIndex)
        .pivoted(34, 24);
}
