import { DisplayObject } from "pixi.js";
import { container } from "../../lib/pixi/container";
import { Undefined } from "../../lib/types/undefined";
import { RpgStatus } from "../rpg/rpg-status";
import { objHealthBar } from "./obj-health-bar";

export function objEnemyHealthBars() {
    const getRpgStatusEffects = (obj: DisplayObject, status: RpgStatus.Model): RpgStatus.Effects => {
        let healthBarObj = Undefined<ObjEnemyHealthBar>();

        const ensureHealthBarObj = () => {
            if (!healthBarObj)
                healthBarObj = objEnemyHealthBar(obj, status).show(c);
            return healthBarObj;
        }

        return {
            healed(value, delta) {
                ensureHealthBarObj().effects.healed(value, delta);
            },
            tookDamage(value, delta, kind) {
                ensureHealthBarObj().effects.tookDamage(value, delta, kind);
            },
        }
    }

    const c = container().named('EnemyHealthBars')
        .merge({
            getRpgStatusEffects,
        });

    return c;
}

function objEnemyHealthBar(obj: DisplayObject, status: RpgStatus.Model) {
    return objHealthBar(32, 7, status.health, status.healthMax)
        .step(self => {
            if (obj.parent?.destroyed)
                return self.destroy();
        })
}

type ObjEnemyHealthBar = ReturnType<typeof objEnemyHealthBar>;
export type ObjEnemyHealthBars = ReturnType<typeof objEnemyHealthBars>;