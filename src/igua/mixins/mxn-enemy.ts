import { DisplayObject } from "pixi.js";
import { RpgStatus } from "../rpg/rpg-status";
import { SceneLocal } from "../../lib/game-engine/scene-local";
import { mxnRpgStatus } from "./mxn-rpg-status";
import { RpgLoot } from "../rpg/rpg-loot";
import { RpgEnemy } from "../rpg/rpg-enemy";
import { objLootDrop } from "../objects/obj-loot-drop";

// const EnemyRpgStatusEffects = new SceneLocal<RpgStatus.Effects>(() => {
//     return {
//         healed(value, delta) {
//             // TODO implement
//         },
//         tookDamage(value, delta, kind) {
//             // TODO implement
//         },
//     }
// }, 'EnemyRpgStatusEffects');

class EnemyRpgStatusEffects implements RpgStatus.Effects {
    constructor(private readonly _onDied: () => void) {

    }

    healed(value: number, delta: number): void {
        // TODO impl, likely call to some SceneLocal to render health bar
    }

    tookDamage(value: number, delta: number, kind: RpgStatus.DamageKind): void {
        // TODO impl, likely call to some SceneLocal to render health bar
        // Feels like RpgStatus.Effects should have a died() method?!
        if (value === 0)
            this._onDied();
    }
}

export function mxnEnemy(obj: DisplayObject) {
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

    // TODO needs more than just destroy
    // Particle effects
    // Loot
    // Might need to be overrideable too, actually
    // Thinking about the dassmann fight from igua 1
    const effects = new EnemyRpgStatusEffects(() => {
        const drop = RpgLoot.Methods.drop(loot, enemy);
        objLootDrop(drop).at(obj).show(obj.parent);
        obj.destroy();
    });

    // TODO should it expose a way to register hitboxes/hurtboxes
    // Or should that be another mixin?

    // TODO maybe exposes a way to create projectiles associated with this enemy?

    const enemyObj = obj.mixin(mxnRpgStatus, status, effects)
        .merge({
            // TODO needs other damage types!!
            // Maybe it's time for a RpgAttack.Model ?!
            strikePlayer(damage: number) {
                RpgEnemy.Methods.strikePlayer(enemy, 0, damage, 0);
            }
        });

    return enemyObj;
}

export type MxnEnemy = ReturnType<typeof mxnEnemy>;