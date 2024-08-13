import { DisplayObject } from "pixi.js";
import { RpgStatus } from "../rpg/rpg-status";
import { mxnRpgStatus } from "./mxn-rpg-status";
import { RpgLoot } from "../rpg/rpg-loot";
import { RpgEnemy } from "../rpg/rpg-enemy";
import { objLootDrop } from "../objects/obj-loot-drop";
import { layers } from "../globals";
import { RpgFaction } from "../rpg/rpg-faction";
import { RpgAttack } from "../rpg/rpg-attack";

interface MxnEnemyArgs {
    hurtboxes: DisplayObject[];
}

export function mxnEnemy(obj: DisplayObject, args: MxnEnemyArgs) {
    // TODO config probably comes from args!!
    const status: RpgStatus.Model = {
        health: 30,
        healthMax: 30,
        invulnerable: 0,
        invulnerableMax: 15,
        poison: {
            level: 0,
            max: 100,
            value: 0,
        },
        faction: RpgFaction.Enemy,
        quirks: {
            emotionalDamageIsFatal: false,
        }
    };

    // TODO this should also come from args
    const loot: RpgLoot.Model = {
        valuables: {
            max: 7,
            min: 2,
            deltaShame: -3,
        }
    };

    const enemy: RpgEnemy.Model = {
        shameCount: 0,
    }

    const effects = layers.overlay.enemyHealthBars.getRpgStatusEffects(obj, status);

    // TODO should it expose a way to register hitboxes/hurtboxes
    // Or should that be another mixin?

    // TODO maybe exposes a way to create projectiles associated with this enemy?

    const enemyObj = obj.mixin(mxnRpgStatus, { status, effects, hurtboxes: args.hurtboxes })
        // TODO needs more
        // Particle effects
        // Might need to be overrideable too, actually
        // Thinking about the dassmann fight from igua 1
        .handles('rpgStatus.died', () => {
            const drop = RpgLoot.Methods.drop(loot, enemy);
            objLootDrop(drop).at(obj).show(obj.parent);
            obj.destroy();
        })
        .merge({
            // TODO needs other damage types!!
            // Maybe it's time for a RpgAttack.Model ?!
            strikePlayer(attack: RpgAttack.Model) {
                RpgEnemy.Methods.strikePlayer(enemy, attack);
            }
        });

    return enemyObj;
}

export type MxnEnemy = ReturnType<typeof mxnEnemy>;