import { DisplayObject } from "pixi.js";
import { Coro } from "../../../lib/game-engine/routines/coro";
import { holdf } from "../../../lib/game-engine/routines/hold";
import { interp } from "../../../lib/game-engine/routines/interp";
import { sleep } from "../../../lib/game-engine/routines/sleep";
import { Rng } from "../../../lib/math/rng";
import { ZIndex } from "../../core/scene/z-index";
import { NpcLooks } from "../../data/data-npc-looks";
import { mxnDestroyAfterSteps } from "../../mixins/mxn-destroy-after-steps";
import { mxnDetectPlayer } from "../../mixins/mxn-detect-player";
import { mxnEnemy } from "../../mixins/mxn-enemy";
import { mxnEnemyDeathBurst } from "../../mixins/mxn-enemy-death-burst";
import { mxnRpgAttack } from "../../mixins/mxn-rpg-attack";
import { RpgAttack } from "../../rpg/rpg-attack";
import { RpgEnemyRank } from "../../rpg/rpg-enemy-rank";
import { objIguanaLocomotive } from "../obj-iguana-locomotive";
import { objProjectileCrackedEarth } from "../projectiles/obj-projectile-cracked-earth";

const ranks = {
    level0: RpgEnemyRank.create({
        status: {
            healthMax: 30,
        },
        loot: {
            tier0: [{ kind: "pocket_item", id: "BoneTypeA" }],
        },
    }),
};

type Feature = "overheat_trail";

const variants = {
    level0: {
        rank: ranks.level0,
        features: new Set<Feature>(["overheat_trail"]),
    },
};

const atks = {
    overheatTrail: RpgAttack.create({
        conditions: {
            overheat: {
                value: 5,
                damage: 30,
            },
        },
    }),
};

export function objAngelSkeliguana() {
    const { rank, features } = variants.level0;
    const hurtboxObjs = new Array<DisplayObject>();
    let sinceDamagedStepsCount = 999;

    const obj = objIguanaLocomotive(NpcLooks.Skeleton0)
        .mixin(mxnEnemy, { rank, hurtboxes: hurtboxObjs })
        .mixin(mxnDetectPlayer)
        .mixin(mxnEnemyDeathBurst, { map: [0xffffff, 0xE8E3E3, 0xbdbdbd] });

    const moves = {
        *idle() {
            obj.walkingTopSpeed = 1;
            let left = Rng.bool();

            for (let i = 0; i < 2; i++) {
                obj.auto.facing = left ? -1 : 1;

                yield sleep(200);

                obj.isMovingLeft = left;
                obj.isMovingRight = !left;

                let hitWall = false;

                yield* Coro.race([
                    Coro.chain([holdf(() => obj.speed.x === 0, 2), () => hitWall = true]),
                    sleep(Rng.int(2000, 3000)),
                ]);

                if (hitWall && i === 0) {
                    left = !left;
                    continue;
                }

                obj.isMovingLeft = false;
                obj.isMovingRight = false;

                yield sleep(Rng.int(333, 666));
            }
        },
    };

    return obj
        .handles("damaged", (_, event) => {
            if (event.rejected) {
                return;
            }

            sinceDamagedStepsCount = 0;
        })
        .coro(function* (self) {
            self.isSkeleton = true;
            hurtboxObjs.push(self.head, self.body);
        })
        .step(() => sinceDamagedStepsCount++)
        .coro(function* (self) {
            while (true) {
                yield () => sinceDamagedStepsCount < 30;
                self.head.mouth.emote.sad();
                yield interp(self.head.mouth, "agape").to(1).over(200);
                yield () => sinceDamagedStepsCount > 30;
                yield interp(self.head.mouth, "agape").to(0).over(200);
                self.head.mouth.emote.clear();
            }
        })
        .coro(function* (self) {
            while (true) {
                yield* moves.idle();
            }
        })
        .coro(function* (self) {
            if (!features.has("overheat_trail")) {
                return;
            }

            while (true) {
                yield () => self.isOnGround;

                const trailObj = objProjectileCrackedEarth(100)
                    .at(self)
                    .add(-50, -3)
                    .mixin(mxnDestroyAfterSteps, 90)
                    .mixin(mxnRpgAttack, { attacker: self.status, attack: atks.overheatTrail })
                    .show();

                yield sleep(500);

                trailObj.alpha = 0.7;
            }
        })
        .zIndexed(ZIndex.CharacterEntities);
}
