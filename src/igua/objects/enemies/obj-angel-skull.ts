import { Sfx } from "../../../assets/sounds";
import { interp } from "../../../lib/game-engine/routines/interp";
import { sleep, sleepf } from "../../../lib/game-engine/routines/sleep";
import { Rng } from "../../../lib/math/rng";
import { container } from "../../../lib/pixi/container";
import { DataNpcLooks } from "../../data/data-npc-looks";
import { mxnIguanaSprites, objIguanaHead } from "../../iguana/obj-iguana-puppet";
import { mxnDestroyOnStatusDeath } from "../../mixins/mxn-destroy-on-status-death";
import { mxnEnemy } from "../../mixins/mxn-enemy";
import { mxnPhysics } from "../../mixins/mxn-physics";
import { mxnRpgAttack, MxnRpgAttackArgs } from "../../mixins/mxn-rpg-attack";
import { RpgEnemyRank } from "../../rpg/rpg-enemy-rank";
import { objFxFieryBurst170px } from "../effects/obj-fx-fiery-burst-170px";
import { objFxFizzle } from "../effects/obj-fx-fizzle";
import { objFxRipple } from "../effects/obj-fx-ripple";

const ranks = {
    level0: RpgEnemyRank.create({
        status: {
            healthMax: 13,
        },
        level: 25,
    }),
};

export function objAngelSkull(args: objAngelSkull.Args) {
    const iguanaHeadObj = objIguanaHead(DataNpcLooks.Skeleton0.head)
        .mixin(mxnIguanaSprites);

    iguanaHeadObj.mxnIguanaSprites.isSkeleton = true;

    return container(
        container(iguanaHeadObj).at(-13, 8),
    )
        .mixin(mxnPhysics, { physicsRadius: 5, gravity: 0.2 })
        .handles("moved", (self, event) => {
            if (event.hitGround && !event.previousOnGround) {
                self.play(Sfx.Enemy.Skeliguana.SkullLand.rate(0.9, 1.1));
                self.speed.x = 0;
            }
        })
        .step(self => {
            self.angle = self.speed.x === 0 ? 0 : Math.round(self.x / 20) * 90;
        })
        .coro(function* (self) {
            if (args.attacker) {
                self.mixin(mxnDestroyOnStatusDeath, args.attacker);
            }

            self.physicsEnabled = false;
            yield sleepf(3);
            self.physicsEnabled = true;
            yield () => self.isOnGround;

            const enemySelf = self
                .mixin(mxnEnemy, { rank: ranks.level0, hurtboxes: [iguanaHeadObj] })
                .handles("mxnEnemy.died", (self) => {
                    self.play(Sfx.Enemy.Skeliguana.SkullDestroy.rate(0.9, 1.1));
                    objFxFizzle().tinted(0xb0b0b0).at(self).show();
                });

            iguanaHeadObj
                .coro(function* (self) {
                    yield interp(self.mouth, "agape").to(1).over(500);
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
                .show(self);

            self
                .coro(function* () {
                    let i = 0;
                    while (!rippleObj.destroyed) {
                        self.x += Rng.intp();
                        self.play(Sfx.Enemy.Skeliguana.SkullTick.rate(0.5 + (i++) * 0.2));
                        yield sleep(333);
                    }
                });

            yield () => rippleObj.destroyed;

            self.play(Sfx.Interact.BombExplode.rate(0.95, 1.05));

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
