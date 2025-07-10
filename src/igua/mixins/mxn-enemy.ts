import { DisplayObject } from "pixi.js";
import { Sfx } from "../../assets/sounds";
import { Rng } from "../../lib/math/rng";
import { clone } from "../../lib/object/clone";
import { merge } from "../../lib/object/merge";
import { layers } from "../globals";
import { ObjAngelEyes } from "../objects/enemies/obj-angel-eyes";
import { objLootDrop } from "../objects/obj-loot-drop";
import { playerObj } from "../objects/obj-player";
import { RpgAttack } from "../rpg/rpg-attack";
import { RpgEnemyRank } from "../rpg/rpg-enemy-rank";
import { RpgLoot } from "../rpg/rpg-loot";
import { RpgProgress } from "../rpg/rpg-progress";
import { RpgStatus } from "../rpg/rpg-status";
import { mxnRpgStatus } from "./mxn-rpg-status";

interface MxnEnemyArgs {
    hurtboxes: DisplayObject[];
    rank: RpgEnemyRank.Model;
    healthbarAnchorObj?: DisplayObject;
    angelEyesObj?: ObjAngelEyes;
    soulAnchorObj?: DisplayObject;
}

export function mxnEnemy(obj: DisplayObject, args: MxnEnemyArgs) {
    const { status, loot } = clone(args.rank);

    const died = () => {
        // TODO needs more
        // Particle effects
        // Might need to be overrideable too, actually
        // Thinking about the dassmann fight from igua 1
        Sfx.Impact.DefeatEnemy.play();
        const drop = RpgLoot.Methods.drop(loot, status, RpgProgress.character.buffs.loot);
        objLootDrop(drop).at(enemyObj.mxnEnemy.soulAnchorObj.getWorldPosition()).show();
        enemyObj.dispatch("mxnEnemy.died");
        obj.destroy();
    };

    const effects: RpgStatus.Effects = merge(
        // TODO it might be time to rethink the effects approach
        { died, ballonHealthDepleted() {}, ballonCreated() {} },
        layers.overlay.enemyHealthBars.getRpgStatusEffects(args.healthbarAnchorObj ?? obj, status),
    );

    // TODO should it expose a way to register hitboxes/hurtboxes
    // Or should that be another mixin?

    // TODO maybe exposes a way to create projectiles associated with this enemy?

    let leftEyeInjuredStepsCount = -1;
    let rightEyeInjuredStepsCount = -1;

    const enemyObj = obj.mixin(mxnRpgStatus, { status, effects, hurtboxes: args.hurtboxes })
        .dispatches<"mxnEnemy.died">()
        .handles("damaged", (self, result) => {
            if (!result.rejected && result.damaged) {
                Rng.choose(
                    Sfx.Impact.VsEnemyPhysical0,
                    Sfx.Impact.VsEnemyPhysical1,
                    Sfx.Impact.VsEnemyPhysical2,
                ).play();

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
        })
        .merge({
            // TODO should this be on the `mxnEnemy`?
            // Or actually... should this be removed?
            strikePlayer(attack: RpgAttack.Model) {
                playerObj.damage(attack, status);
            },
        })
        .merge({
            mxnEnemy: {
                soulAnchorObj: args.soulAnchorObj ?? obj,
            },
        })
        .track(mxnEnemy);

    if (args.angelEyesObj) {
        enemyObj.step(() => {
            if (leftEyeInjuredStepsCount > 0) {
                leftEyeInjuredStepsCount--;
            }

            if (rightEyeInjuredStepsCount > 0) {
                rightEyeInjuredStepsCount--;
            }

            args.angelEyesObj!.injuredLeft = leftEyeInjuredStepsCount > 0;
            args.angelEyesObj!.injuredRight = rightEyeInjuredStepsCount > 0;
        });
    }

    return enemyObj;
}

export type MxnEnemy = ReturnType<typeof mxnEnemy>;
