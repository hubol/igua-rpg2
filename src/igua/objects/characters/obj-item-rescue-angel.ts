import { Graphics, Sprite } from "pixi.js";
import { Tx } from "../../../assets/textures";
import { factor, interp, interpvr } from "../../../lib/game-engine/routines/interp";
import { sleep } from "../../../lib/game-engine/routines/sleep";
import { container } from "../../../lib/pixi/container";
import { scene } from "../../globals";
import { mxnBoilPivot } from "../../mixins/mxn-boil-pivot";
import { mxnSinePivot } from "../../mixins/mxn-sine-pivot";
import { objIndexedSprite } from "../utils/obj-indexed-sprite";

const [propellerTx0, propellerTx1, propellerTx2, bagTx, legsTx, armTx, dressTx, nogginTx, faceTx] = Tx.Characters
    .ItemRescueAngel.split({
        width: 74,
    });

function objItemRescueAngelPuppet() {
    const coros = {
        *removeBag() {
            yield interp(bagObj, "alpha").steps(2).to(0).over(333);
            yield sleep(333);
            yield interpvr(armObj).factor(factor.sine).translate(34, 0).over(333);
        },
    };

    const armMaskObj = new Graphics().beginFill(0xff0000).drawRect(12, 29, 34, 21);
    const armObj = Sprite.from(armTx).masked(armMaskObj);
    const bagObj = Sprite.from(bagTx);

    return container(
        objIndexedSprite([propellerTx0, propellerTx1, propellerTx2, propellerTx1])
            .step(self => self.textureIndex = (self.textureIndex + 0.2) % self.textures.length),
        Sprite.from(legsTx).mixin(mxnBoilPivot),
        bagObj,
        armObj,
        armMaskObj,
        Sprite.from(dressTx),
        Sprite.from(nogginTx),
        Sprite.from(faceTx).mixin(mxnSinePivot),
    )
        .step(self => self.pivot.y = Math.round(Math.sin(scene.ticker.ticks * 0.1) * 3))
        .merge({ coros });
}

export function objItemRescueAngel() {
    return objItemRescueAngelPuppet()
        .coro(function* (self) {
            yield sleep(5000);
            yield* self.coros.removeBag();
        });
}
