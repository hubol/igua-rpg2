import { Sprite } from "pixi.js";
import { Tx } from "../../../assets/textures";
import { interp } from "../../../lib/game-engine/routines/interp";
import { sleepf } from "../../../lib/game-engine/routines/sleep";
import { container } from "../../../lib/pixi/container";
import { mxnBoilPivot } from "../../mixins/mxn-boil-pivot";
import { mxnDestroyOnStatusDeath } from "../../mixins/mxn-destroy-on-status-death";
import { mxnEnemy } from "../../mixins/mxn-enemy";
import { mxnPhysics } from "../../mixins/mxn-physics";
import { mxnRpgAttack, MxnRpgAttackArgs } from "../../mixins/mxn-rpg-attack";
import { RpgEnemyRank } from "../../rpg/rpg-enemy-rank";
import { objFxFieryBurst170px } from "../effects/obj-fx-fiery-burst-170px";
import { objFxRipple } from "../effects/obj-fx-ripple";

const txs = Tx.Enemy.Skeliguana.SkullTrap.split({ count: 2 });

const ranks = {
    level0: RpgEnemyRank.create({
        status: {
            healthMax: 15,
        },
        level: 25,
    }),
};

export function objAngelSkull(args: objAngelSkull.Args) {
    const skullObj = Sprite.from(txs[0]);
    const eyesObj = Sprite.from(txs[1]);

    eyesObj.alpha = 0;

    return container(
        skullObj,
        eyesObj
            .mixin(mxnBoilPivot),
    )
        .pivoted(16, 12)
        .mixin(mxnPhysics, { physicsRadius: 5, gravity: 0.2 })
        .handles("moved", (self, event) => {
            if (event.hitGround) {
                self.speed.x = 0;
            }
        })
        .step(self => {
            self.angle = self.speed.x === 0 ? 0 : Math.round(self.x / 20) * 90;
        })
        .coro(function* (self) {
            self.physicsEnabled = false;
            yield sleepf(3);
            self.physicsEnabled = true;
            yield () => self.isOnGround;

            const enemySelf = self.mixin(mxnEnemy, { rank: ranks.level0, hurtboxes: [skullObj] });

            eyesObj
                .coro(function* (self) {
                    yield interp(self, "alpha").steps(4).to(1).over(500);
                });

            const rippleObj = objFxRipple(
                {
                    radius: 80,
                    stroke: 1,
                    tint: 0x500500,
                },
                {
                    radius: 5,
                    stroke: 5,
                    tint: 0xf7bb17,
                },
            )
                .mixin(mxnDestroyOnStatusDeath, enemySelf.status)
                .mxnFxFactor.play(2000)
                .at(self)
                .step(rippleObj => rippleObj.at(self))
                .show();

            yield () => rippleObj.destroyed;

            objFxFieryBurst170px()
                .mixin(mxnRpgAttack, args)
                .at(self)
                .show();

            self.destroy();
        });
}

namespace objAngelSkull {
    export type Args = MxnRpgAttackArgs;
}
