import { DisplayObject } from "pixi.js";
import { RpgStatus } from "../rpg/rpg-status";
import { SceneLocal } from "../../lib/game-engine/scene-local";
import { mxnRpgStatus } from "./mxn-rpg-status";

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
        if (value === 0)
            this._onDied();
    }
}

export function mxnEnemy(obj: DisplayObject) {
    // TODO config probably comes from args!!
    const status: RpgStatus.Model = {
        health: 100,
        healthMax: 100,
        invulnerable: 0,
        invulnerableMax: 15,
        poison: {
            level: 0,
            max: 100,
            value: 0,
        }
    };

    // TODO needs more than just destroy
    // Particle effects
    // Loot
    // Might need to be overrideable too, actually
    // Thinking about the dassmann fight from igua 1
    const effects = new EnemyRpgStatusEffects(() => obj.destroy());

    // TODO should it expose a way to register hitboxes/hurtboxes
    // Or should that be another mixin?

    // TODO maybe exposes a way to create projectiles associated with this enemy?

    const enemy = obj.mixin(mxnRpgStatus, status, effects);

    return enemy;
}

export type MxnEnemy = ReturnType<typeof mxnEnemy>;