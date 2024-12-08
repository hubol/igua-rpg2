import { DisplayObject, Rectangle } from "pixi.js";
import { container } from "../../lib/pixi/container";
import { Undefined } from "../../lib/types/undefined";
import { RpgStatus } from "../rpg/rpg-status";
import { objHealthBar } from "./obj-health-bar";
import { vnew } from "../../lib/math/vector-type";
import { scene } from "../globals";
import { mxnOnSceneChange } from "../mixins/mxn-on-scene-change";
import { sleepf } from "../../lib/game-engine/routines/sleep";
import { playerObj } from "./obj-player";

export function objEnemyHealthBars() {
    const getRpgStatusEffects = (obj: DisplayObject, status: RpgStatus.Model): Omit<RpgStatus.Effects, "died"> => {
        let healthBarObj = Undefined<ObjEnemyHealthBar>();

        const ensureHealthBarObj = () => {
            if (!healthBarObj || healthBarObj.destroyed) {
                healthBarObj = objEnemyHealthBar(obj, status).show(c);
            }
            return healthBarObj;
        };

        return {
            healed(value, delta) {
                ensureHealthBarObj().effects.healed(value, delta);
            },
            tookDamage(value, delta, kind) {
                ensureHealthBarObj().effects.tookDamage(value, delta, kind);
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

function objEnemyHealthBar(obj: DisplayObject, status: RpgStatus.Model) {
    const vworld = vnew();

    return objHealthBar(32, 9, status.healthMax, status.healthMax)
        .step(self => {
            // TODO should be a cuter in/out animation
            self.visible = self.stepsSinceChange < 60;
            if (!self.visible && obj.destroyed) {
                return self.destroy();
            }

            if (!obj.destroyed) {
                obj.getBounds(false, r);
                vworld.at(r).add(Math.round(r.width / 2), 0).add(scene.camera);
            }

            self.at(vworld).add(scene.camera, -1).add(-Math.round(self.width / 2), -self.height - 1);
        })
        .mixin(mxnOnSceneChange, (self) => self.destroy())
        .coro(function* (self) {
            while (true) {
                yield () => self.stepsSinceChange < 2;
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
        });
}

type ObjEnemyHealthBar = ReturnType<typeof objEnemyHealthBar>;
export type ObjEnemyHealthBars = ReturnType<typeof objEnemyHealthBars>;
