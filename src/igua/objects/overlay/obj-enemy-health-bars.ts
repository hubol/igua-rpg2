import { DisplayObject, Rectangle } from "pixi.js";
import { sleepf } from "../../../lib/game-engine/routines/sleep";
import { vnew } from "../../../lib/math/vector-type";
import { container } from "../../../lib/pixi/container";
import { Undefined } from "../../../lib/types/undefined";
import { scene } from "../../globals";
import { mxnOnSceneChange } from "../../mixins/mxn-on-scene-change";
import { RpgStatus } from "../../rpg/rpg-status";
import { playerObj } from "../obj-player";
import { objBuildUpBar } from "./obj-build-up-bar";
import { objHealthBar } from "./obj-health-bar";

export function objEnemyHealthBars() {
    const getRpgStatusEffects = (
        obj: DisplayObject,
        status: RpgStatus.Model,
    ): Pick<RpgStatus.Effects, "healed" | "tookDamage"> => {
        let healthBarObj = Undefined<ObjEnemyHealthBar>();

        const ensureHealthBarObj = (healthVisible = true) => {
            if (!healthBarObj || healthBarObj.destroyed) {
                healthBarObj = objEnemyHealthBar(obj, status, healthVisible).show(c);
            }
            return healthBarObj;
        };

        c.coro(function* () {
            yield () => status.conditions.overheat.value > 0 || obj.destroyed;
            if (!obj.destroyed) {
                ensureHealthBarObj(false);
            }
        });

        return {
            healed(value, delta) {
                ensureHealthBarObj().effects.healed(value, delta);
            },
            tookDamage(
                remainingHealth,
                physicalDamage,
                emotionalDamage,
                poisonDamage,
                overheatDamage,
            ) {
                ensureHealthBarObj().effects.tookDamage(
                    remainingHealth,
                    physicalDamage,
                    emotionalDamage,
                    poisonDamage,
                    overheatDamage,
                );
            },
        };
    };

    const c = container().named("EnemyHealthBars")
        .merge({
            getRpgStatusEffects,
        });

    return c;
}

const r = new Rectangle();
const v = vnew();

function objEnemyHealthBar(obj: DisplayObject, status: RpgStatus.Model, healthVisible: boolean) {
    const vworld = vnew();

    const healthBarObj = objHealthBar(32, 9, status.healthMax, status.healthMax);

    if (!healthVisible) {
        healthBarObj.stepsSinceChange = 60;
    }

    const overheatBarObj = objBuildUpBar({
        width: 32,
        height: 2,
        get max() {
            return status.conditions.overheat.max;
        },
        get value() {
            return status.conditions.overheat.value;
        },
        tints: objBuildUpBar.tints.Overheat,
    });

    function updateEnemyWorldPosition() {
        if (!obj.destroyed) {
            obj.getBounds(false, r);
            vworld.at(r).add(Math.round(r.width / 2), 0).add(scene.camera);
        }
    }

    updateEnemyWorldPosition();

    return container(healthBarObj, overheatBarObj.at(0, -3))
        .step(self => {
            // TODO should be a cuter in/out animation
            healthBarObj.visible = healthBarObj.stepsSinceChange < 60;
            if (!healthBarObj.visible && obj.destroyed) {
                return self.destroy();
            }

            updateEnemyWorldPosition();

            self.at(vworld).add(scene.camera, -1).add(-Math.round(self.width / 2), -healthBarObj.height - 1);
        })
        .mixin(mxnOnSceneChange, (self) => self.destroy())
        .coro(function* (self) {
            while (true) {
                yield () => healthBarObj.stepsSinceChange < 2;
                v.at(vworld).add(playerObj, -1).normalize();
                const pivotProperty = Math.abs(v.x) > Math.abs(v.y) ? "x" : "y";
                self.pivot[pivotProperty] = -3;
                yield sleepf(1);
                self.pivot[pivotProperty] = 2;
                yield sleepf(4);
                self.pivot[pivotProperty] = -1;
                yield sleepf(5);
                self.pivot[pivotProperty] = 0;
            }
        })
        .merge({ effects: healthBarObj.effects });
}

type ObjEnemyHealthBar = ReturnType<typeof objEnemyHealthBar>;
export type ObjEnemyHealthBars = ReturnType<typeof objEnemyHealthBars>;
