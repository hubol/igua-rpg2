import { Graphics, Sprite } from "pixi.js";
import { Tx } from "../../../assets/textures";
import { factor, interp, interpvr } from "../../../lib/game-engine/routines/interp";
import { sleepf } from "../../../lib/game-engine/routines/sleep";
import { container } from "../../../lib/pixi/container";
import { ZIndex } from "../../core/scene/z-index";
import { scene } from "../../globals";
import { MxnEnemy, mxnEnemy } from "../../mixins/mxn-enemy";
import { mxnPhysics } from "../../mixins/mxn-physics";
import { MxnRpgStatus } from "../../mixins/mxn-rpg-status";
import { RpgEnemyRank } from "../../rpg/rpg-enemy-rank";
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
        .pivoted(13, 24)
        .coro(function* (self) {
            yield sleepf(3);
            yield () => self.isOnGround;
            const dirtObj = Sprite.from(txs.txDirt).tinted(scene.style.terrainTint).show(self).at(0, 6);
            yield interpvr(dirtObj).factor(factor.sine).to(0, 0).over(250);
            const sproutObj = objIndexedSprite(txs.txsSprout);
            yield interp(sproutObj, "textureIndex").to(sproutObj.textures.length).over(1000);
        })
        .zIndexed(ZIndex.Entities - 1);
}
