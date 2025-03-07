import { DisplayObject } from "pixi.js";
import { Sfx } from "../../assets/sounds";
import { Rng } from "../../lib/math/rng";
import { clone } from "../../lib/object/clone";
import { merge } from "../../lib/object/merge";
import { layers } from "../globals";
import { objLootDrop } from "../objects/obj-loot-drop";
import { playerObj } from "../objects/obj-player";
import { RpgAttack } from "../rpg/rpg-attack";
import { RpgEnemyRank } from "../rpg/rpg-enemy-rank";
import { RpgLoot } from "../rpg/rpg-loot";
import { RpgStatus } from "../rpg/rpg-status";
import { mxnRpgStatus } from "./mxn-rpg-status";

interface MxnEnemyArgs {
    hurtboxes: DisplayObject[];
    rank: RpgEnemyRank.Model;
    healthbarAnchorObj?: DisplayObject;
}

export function mxnEnemy(obj: DisplayObject, args: MxnEnemyArgs) {
    const { status, loot } = clone(args.rank);

    const died = () => {
        // TODO needs more
        // Particle effects
        // Might need to be overrideable too, actually
        // Thinking about the dassmann fight from igua 1
        Sfx.Impact.DefeatEnemy.play();
        const drop = RpgLoot.Methods.drop(loot, status);
        objLootDrop(drop).at(obj).show(obj.parent);
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

    const enemyObj = obj.mixin(mxnRpgStatus, { status, effects, hurtboxes: args.hurtboxes })
        .dispatches<"mxnEnemy.died">()
        .handles("damaged", defaultDamagedHandler)
        .merge({
            strikePlayer(attack: RpgAttack.Model) {
                playerObj.damage(attack, status);
            },
        })
        .track(mxnEnemy);

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
