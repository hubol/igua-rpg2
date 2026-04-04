import { Container, DisplayObject } from "pixi.js";
import { Sfx } from "../../assets/sounds";
import { Rng } from "../../lib/math/rng";
import { clone } from "../../lib/object/clone";
import { layers } from "../globals";
import { objAngelEyes } from "../objects/enemies/obj-angel-eyes";
import { objLootDrop } from "../objects/obj-loot-drop";
import { playerObj } from "../objects/obj-player";
import { Rpg } from "../rpg/rpg";
import { RpgEnemyRank } from "../rpg/rpg-enemy-rank";
import { RpgStatus } from "../rpg/rpg-status";
import { mxnRpgStatus } from "./mxn-rpg-status";
import { mxnRpgStatusBerry } from "./mxn-rpg-status-berry";
import { mxnRpgStatusPotions } from "./mxn-rpg-status-potions";

interface MxnEnemyArgs {
    hurtboxes: DisplayObject[];
    rank: RpgEnemyRank.Model;
    healthbarAnchorObj?: DisplayObject;
    soulAnchorObj?: DisplayObject;
}

export function mxnEnemy(obj: Container, args: MxnEnemyArgs) {
    const { status, loot } = clone(args.rank);

    const died = (attacker: RpgStatus.Model | null) => {
        if (attacker?.quirks.successfulAttacksRewardExperience) {
            Rpg.experience.reward.combat.onEnemyDefeat(args.rank.level);
        }
        const drop = Rpg.loot.drop(loot, status, Rpg.character.buffs.loot);
        objLootDrop(drop).at(enemyObj.mxnEnemy.soulAnchorObj.getWorldPosition()).show();
        enemyObj.dispatch("mxnEnemy.died");
        obj.destroy();
    };

    const { healed, tookDamage: healthBarTookDamage } = layers.overlay.enemyHealthBars.getRpgStatusEffects(
        args.healthbarAnchorObj ?? obj,
        status,
    );
    // TODO it might be time to rethink the effects approach
    const effects: RpgStatus.Effects = {
        died,
        ballonHealthDepleted() {},
        ballonCreated() {},
        healed,
        tookDamage(value, delta, kind, attacker, attack) {
            if (attacker?.quirks?.successfulAttacksRewardExperience && attack && delta > 0) {
                Rpg.experience.reward.combat.onAttackDamage(attack, delta);
            }
            healthBarTookDamage(value, delta, kind, attacker, attack);
        },
    };

    // TODO should it expose a way to register hitboxes/hurtboxes
    // Or should that be another mixin?

    // TODO maybe exposes a way to create projectiles associated with this enemy?

    let leftEyeInjuredStepsCount = -1;
    let rightEyeInjuredStepsCount = -1;

    const enemyObj = obj
        .mixin(mxnRpgStatus, { status, effects, hurtboxes: args.hurtboxes })
        .mixin(mxnRpgStatusPotions, { heldPotionIds: [] })
        .mixin(mxnRpgStatusBerry)
        .dispatches<"mxnEnemy.died">()
        .handles("damaged", (self, result) => {
            if (result.rejected) {
                return;
            }
            if (result.damaged) {
                self.play(Rng.choose(
                    Sfx.Impact.VsEnemyPhysical0,
                    Sfx.Impact.VsEnemyPhysical1,
                    Sfx.Impact.VsEnemyPhysical2,
                ));

                // TODO rather arbitrary positions
                if (playerObj.x > self.x + 22) {
                    rightEyeInjuredStepsCount = 20;
                }
                else if (playerObj.x < self.x - 22) {
                    leftEyeInjuredStepsCount = 20;
                }
                else {
                    rightEyeInjuredStepsCount = Rng.intc(12, 20);
                    leftEyeInjuredStepsCount = Rng.intc(12, 20);
                }
            }
            else if (!result.ambient) {
                self.play(Sfx.Impact.VsEnemyBlocked);
            }
        })
        .merge({
            mxnEnemy: {
                soulAnchorObj: args.soulAnchorObj ?? obj,
            },
        })
        .track(mxnEnemy);

    const angelEyesObj = enemyObj.findIs(objAngelEyes).last;

    if (angelEyesObj) {
        enemyObj.step(() => {
            if (leftEyeInjuredStepsCount > 0) {
                leftEyeInjuredStepsCount--;
            }

            if (rightEyeInjuredStepsCount > 0) {
                rightEyeInjuredStepsCount--;
            }

            angelEyesObj.injuredLeft = leftEyeInjuredStepsCount > 0;
            angelEyesObj.injuredRight = rightEyeInjuredStepsCount > 0;
        });
    }

    return enemyObj;
}

export type MxnEnemy = ReturnType<typeof mxnEnemy>;
