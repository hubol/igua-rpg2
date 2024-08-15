import { DisplayObject } from "pixi.js";
import { RpgStatus } from "../rpg/rpg-status";
import { mxnRpgStatus } from "./mxn-rpg-status";
import { RpgLoot } from "../rpg/rpg-loot";
import { RpgEnemy } from "../rpg/rpg-enemy";
import { objLootDrop } from "../objects/obj-loot-drop";
import { layers } from "../globals";
import { RpgFaction } from "../rpg/rpg-faction";
import { RpgAttack } from "../rpg/rpg-attack";
import { merge } from "../../lib/object/merge";
import { playerObj } from "../objects/obj-player";
import { DeepPartial } from "../../lib/types/deep-partial";
import { clone } from "../../lib/object/clone";

interface MxnEnemyArgs {
    hurtboxes: DisplayObject[];
    data: MxnEnemyData.Model;
}

// TODO should this be closer to the Rpg level?
export namespace MxnEnemyData {
    export interface Model {
        status: RpgStatus.Model;
        loot: RpgLoot.Model;
    }

    export function create({ status, loot }: DeepPartial<Model>): Model {
        return {
            status: {
                health: status?.health ?? status?.healthMax ?? 30,
                healthMax: status?.healthMax ?? status?.health ?? 30,
                invulnerable: status?.invulnerable ?? 0,
                invulnerableMax: status?.invulnerableMax ?? 15,
                faction: status?.faction ?? RpgFaction.Enemy,
                poison: {
                    value: status?.poison?.value ?? 0,
                    max: status?.poison?.max ?? 100,
                    level: status?.poison?.level ?? 0,
                },
                quirks: {
                    emotionalDamageIsFatal: status?.quirks?.emotionalDamageIsFatal ?? false,
                    incrementsAttackerPrideOnDamage: status?.quirks?.incrementsAttackerPrideOnDamage ?? false,
                },
            },
            loot: {
                valuables: {
                    min: loot?.valuables?.min ?? 1,
                    max: loot?.valuables?.max ?? 2,
                    deltaPride: loot?.valuables?.deltaPride ?? -1,
                }
            }
        }
    }
}

export function mxnEnemy(obj: DisplayObject, args: MxnEnemyArgs) {
    const { status, loot } = clone(args.data);

    const enemy: RpgEnemy.Model = {
        pride: 0,
    }

    const died = () => {
        // TODO needs more
        // Particle effects
        // Might need to be overrideable too, actually
        // Thinking about the dassmann fight from igua 1
        const drop = RpgLoot.Methods.drop(loot, enemy);
        objLootDrop(drop).at(obj).show(obj.parent);
        enemyObj.dispatch('mxnEnemy.died');
        obj.destroy();
    }

    const effects: RpgStatus.Effects = merge(
        { died },
        layers.overlay.enemyHealthBars.getRpgStatusEffects(obj, status));

    // TODO should it expose a way to register hitboxes/hurtboxes
    // Or should that be another mixin?

    // TODO maybe exposes a way to create projectiles associated with this enemy?

    const enemyObj = obj.mixin(mxnRpgStatus, { status, effects, hurtboxes: args.hurtboxes })
        .dispatches<'mxnEnemy.died'>()
        .merge({
            strikePlayer(attack: RpgAttack.Model) {
                playerObj.damage(attack, enemy);
            }
        });

    return enemyObj;
}

export type MxnEnemy = ReturnType<typeof mxnEnemy>;