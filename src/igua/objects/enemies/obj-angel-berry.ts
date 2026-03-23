import { Graphics, Sprite } from "pixi.js";
import { Tx } from "../../../assets/textures";
import { factor, interp, interpv, interpvr } from "../../../lib/game-engine/routines/interp";
import { sleep, sleepf } from "../../../lib/game-engine/routines/sleep";
import { vnew } from "../../../lib/math/vector-type";
import { container } from "../../../lib/pixi/container";
import { ZIndex } from "../../core/scene/z-index";
import { scene } from "../../globals";
import { mxnBoilTextureIndex } from "../../mixins/mxn-boil-texture-index";
import { mxnEnemy } from "../../mixins/mxn-enemy";
import { mxnPhysics } from "../../mixins/mxn-physics";
import { MxnRpgStatus } from "../../mixins/mxn-rpg-status";
import { RpgEnemyRank } from "../../rpg/rpg-enemy-rank";
import { objFxBurst32 } from "../effects/obj-fx-burst-32";
import { objFxHeart } from "../effects/obj-fx-heart";
import { objIndexedSprite } from "../utils/obj-indexed-sprite";

const txs = (() => {
    const [txSeed, txDirt, ...txsSprout] = Tx.Enemy.Berry.Seed.split({ width: 20 });
    const txsHeart = Tx.Enemy.Berry.Heart.split({ width: 18 });
    return {
        txSeed,
        txDirt,
        txsSprout,
        txsHeart,
    };
})();

const ranks = {
    level0: RpgEnemyRank.create({
        status: {
            healthMax: 30,
        },
    }),
};

const consts = {
    healValue: 20,
};

export function objAngelBerry(targetObj: MxnRpgStatus) {
    const hurtboxObj = new Graphics().beginFill(0xff0000).drawRect(6, 10, 12, 17).invisible();

    return container(
        hurtboxObj,
        Sprite.from(txs.txSeed),
    )
        .mixin(mxnPhysics, { gravity: 0.3, physicsRadius: 4, physicsOffset: [0, -4] })
        .handles("moved", (self, event) => {
            if (event.hitGround) {
                self.speed.x = 0;
            }
        })
        .mixin(mxnEnemy, { rank: ranks.level0, hurtboxes: [hurtboxObj] })
        .handles("mxnEnemy.died", (self) => objFxBurst32().at(self).tinted(0xB85BFF).show())
        .pivoted(13, 24)
        .coro(function* (self) {
            yield sleepf(3);
            yield () => self.isOnGround;
            const dirtObj = Sprite.from(txs.txDirt).tinted(scene.style.terrainTint).show(self).at(0, 6);
            yield interpvr(dirtObj).factor(factor.sine).to(0, 0).over(250);
            const sproutObj = objIndexedSprite(txs.txsSprout).show(self);
            yield interp(sproutObj, "textureIndex").to(sproutObj.textures.length).over(1000);
            while (!targetObj.destroyed) {
                const heartObj = objAngelBerryHeart(targetObj).at(self).add(0, -9).show();
                yield () => heartObj.destroyed;
                yield sleep(1000);
            }
        })
        .zIndexed(ZIndex.Entities - 1);
}

const v = vnew();

function objAngelBerryHeart(targetObj: MxnRpgStatus) {
    const speed = vnew();

    return objIndexedSprite(txs.txsHeart)
        .anchored(0.5, 0.5)
        .mixin(mxnBoilTextureIndex)
        .step(self => self.add(speed))
        .coro(function* (self) {
            yield interpv(speed).to(0, -1).over(300);
            self.step(() => {
                if (targetObj.destroyed) {
                    return;
                }

                speed.moveTowards(v.at(targetObj).add(self, -1).normalize(), 0.2);

                if (self.collidesOne(targetObj.hurtboxes)) {
                    targetObj.heal(consts.healValue);
                    objFxHeart.objBurst(6, 5).at(self).show();
                    self.destroy();
                }
            });
            yield () => targetObj.destroyed;
            yield interpv(speed).to(0, -1).over(300);
            yield sleep(500);
            self.destroy();
        });
}
