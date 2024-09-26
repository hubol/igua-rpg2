import { DisplayObject } from "pixi.js";
import { RpgStatus } from "../rpg/rpg-status";
import { mxnRpgStatus } from "./mxn-rpg-status";
import { RpgLoot } from "../rpg/rpg-loot";
import { RpgEnemy } from "../rpg/rpg-enemy";
import { objLootDrop } from "../objects/obj-loot-drop";
import { layers } from "../globals";
import { RpgAttack } from "../rpg/rpg-attack";
import { merge } from "../../lib/object/merge";
import { playerObj } from "../objects/obj-player";
import { clone } from "../../lib/object/clone";
import { RpgEnemyClass } from "../rpg/rpg-enemy-class";
import { Sfx } from "../../assets/sounds";
import { Rng } from "../../lib/math/rng";

interface MxnEnemyArgs {
    hurtboxes: DisplayObject[];
    class: RpgEnemyClass.Model;
}

export function mxnEnemy(obj: DisplayObject, args: MxnEnemyArgs) {
    const { status, loot } = clone(args.class);

    const enemy: RpgEnemy.Model = {
        pride: 0,
    };

    const died = () => {
        // TODO needs more
        // Particle effects
        // Might need to be overrideable too, actually
        // Thinking about the dassmann fight from igua 1
        Sfx.Impact.DefeatEnemy.play();
        const drop = RpgLoot.Methods.drop(loot, enemy);
        objLootDrop(drop).at(obj).show(obj.parent);
        enemyObj.dispatch("mxnEnemy.died");
        obj.destroy();
    };

    const effects: RpgStatus.Effects = merge(
        { died },
        layers.overlay.enemyHealthBars.getRpgStatusEffects(obj, status),
    );

    // TODO should it expose a way to register hitboxes/hurtboxes
    // Or should that be another mixin?

    // TODO maybe exposes a way to create projectiles associated with this enemy?

    const enemyObj = obj.mixin(mxnRpgStatus, { status, effects, hurtboxes: args.hurtboxes })
        .dispatches<"mxnEnemy.died">()
        .handles("damaged", defaultDamagedHandler)
        .merge({
            strikePlayer(attack: RpgAttack.Model) {
                playerObj.damage(attack, enemy);
            },
        });

    return enemyObj;
}

function defaultDamagedHandler(_: unknown, result: RpgStatus.DamageResult) {
    if (!result.rejected && result.damaged) {
        Rng.choose(
            Sfx.Impact.VsEnemyPhysical0,
            Sfx.Impact.VsEnemyPhysical1,
            Sfx.Impact.VsEnemyPhysical2,
        ).play();
    }
}

export type MxnEnemy = ReturnType<typeof mxnEnemy>;
