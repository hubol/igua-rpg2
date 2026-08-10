import { DisplayObject } from "pixi.js";
import { Sfx } from "../../../assets/sounds";
import { Tx } from "../../../assets/textures";
import { Rng } from "../../../lib/math/rng";
import { mxnEnemy } from "../../mixins/mxn-enemy";
import { objIndexedSprite } from "../utils/obj-indexed-sprite";

const aTxs = Tx.Effects.Overheated.split({ width: 26 });
const bTxs = Tx.Effects.OverheatedB.split({ width: 26 });

const txs = [aTxs, bTxs];

export function objFxOverheated() {
    const sprite = objIndexedSprite(Rng.item(txs));
    sprite.scale.x = Rng.intp() * 2 / 3;
    sprite.scale.y = 2 / 3;

    return sprite
        .anchored(12 / 26, 52 / 68)
        .step(self => {
            self.textureIndex += Rng.float(0.1, 0.3);
            if (Rng.bool()) {
                self.y -= 1;
            }
            if (self.textureIndex >= 4) {
                self.destroy();
            }
        });
}

const dummyObjs = new Array<DisplayObject>();

objFxOverheated.createBurstForObject = function createBurstForObject (obj: DisplayObject) {
    obj.play(Sfx.Impact.Overheat.rate(0.9, 1.1));

    dummyObjs.length = 0;
    dummyObjs.push(obj);

    const sourceObjs = obj.is(mxnEnemy) ? obj.hurtboxes : dummyObjs;

    for (let i = 0; i < 8; i++) {
        const bounds = Rng.item(sourceObjs).getWorldBounds();
        objFxOverheated()
            .at(bounds)
            .add(
                Rng.bool()
                    ? Rng.intc(1) * bounds.width
                    : Rng.int(bounds.width),
                Rng.bool()
                    ? Rng.intc(1) * bounds.height
                    : Rng.int(bounds.height),
            )
            .show();
    }
};
