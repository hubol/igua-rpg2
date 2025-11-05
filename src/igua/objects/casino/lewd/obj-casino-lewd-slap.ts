import { Sprite } from "pixi.js";
import { Tx } from "../../../../assets/textures";
import { factor, interp } from "../../../../lib/game-engine/routines/interp";
import { sleep } from "../../../../lib/game-engine/routines/sleep";
import { Rng } from "../../../../lib/math/rng";
import { container } from "../../../../lib/pixi/container";
import { scene } from "../../../globals";
import { mxnBoilPivot } from "../../../mixins/mxn-boil-pivot";
import { mxnBoilTextureIndex } from "../../../mixins/mxn-boil-texture-index";
import { mxnSinePivot } from "../../../mixins/mxn-sine-pivot";
import { objIndexedSprite } from "../../utils/obj-indexed-sprite";

const txs = {
    armAndPp: Tx.Casino.Lewd.Slap.ArmAndPp.split({ width: 102 }),
    armAway: Tx.Casino.Lewd.Slap.ArmAway.split({ width: 60 }),
    head: Tx.Casino.Lewd.Slap.Head.split({ width: 110 }),
    tail: Tx.Casino.Lewd.Slap.Tail.split({ count: 2 }),
    torso: Tx.Casino.Lewd.Slap.Torso.split({ width: 80 }),
};

export function objCasinoLewdSlap() {
    const torsoObj = objIndexedSprite(txs.torso).at(-46, 29);
    const tailObj = objIndexedSprite(txs.tail).at(-86, 60)
        .mixin(mxnBoilPivot)
        .coro(function* (self) {
            while (true) {
                yield () => torsoObj.effectiveTextureIndex === 1;
                self.textureIndex = self.textureIndex === 0 ? 1 : 0;
                yield () => torsoObj.effectiveTextureIndex !== 1;
            }
        });

    return container(
        tailObj,
        torsoObj,
        objHead().at(-59, -57),
        objArmAndPp(),
        objArmAway().at(-51, 28),
    )
        .coro(function* () {
            while (true) {
                yield sleep(Rng.intc(800, 1200));
                yield interp(torsoObj, "textureIndex").to(torsoObj.textures.length).over(Rng.intc(800, 1200));
                yield sleep(Rng.intc(800, 1200));
                yield interp(torsoObj, "textureIndex").to(0).over(Rng.intc(800, 1200));
            }
        })
        .step(self => {
            self.pivot.y = torsoObj.effectiveTextureIndex * -3;
        });
}

function objArmAway() {
    return objIndexedSprite(txs.armAway)
        .coro(function* (self) {
            while (true) {
                yield sleep(Rng.intc(800, 1200));
                yield interp(self, "textureIndex").to(self.textures.length).over(Rng.intc(800, 1200));
                yield sleep(Rng.intc(800, 1200));
                yield interp(self, "textureIndex").to(0).over(Rng.intc(800, 1200));
            }
        });
}

function objHead() {
    const [headTx0, headTx1, collarTx, faceTx] = txs.head;

    return container(
        container(
            objIndexedSprite([headTx0, headTx1]).mixin(mxnBoilTextureIndex),
            Sprite.from(faceTx).mixin(mxnBoilPivot),
        )
            .mixin(mxnSinePivot),
        Sprite.from(collarTx),
    );
}

function objArmAndPp() {
    const textures = [
        // (0) Wind-up
        2,
        1,
        0,
        // (2) Slap
        0,
        1,
        2,
        3,
        4,
        5,
        4,
        3,
        7,
        // (11) Recoil
        3,
        6,
        3,
        7,
        3,
    ]
        .map(index => txs.armAndPp[txs.armAndPp.length - index - 1]);

    return objIndexedSprite(textures)
        .coro(function* (self) {
            while (true) {
                yield interp(self, "textureIndex").to(2).over(Rng.intc(300, 400));
                yield sleep(Rng.intc(120, 320));
                yield interp(self, "textureIndex").to(11).over(
                    Rng.bool() ? Rng.intc(700, 1000) : Rng.intc(400, 600),
                );
                yield interp(self, "textureIndex").to(textures.length).over(600);
                yield sleep(1000);
                self.textureIndex = 0;
                yield sleep(500);
            }
        });
}
