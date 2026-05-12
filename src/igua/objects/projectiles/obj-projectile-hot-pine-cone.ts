import { Sprite } from "pixi.js";
import { Tx } from "../../../assets/textures";
import { interpc } from "../../../lib/game-engine/routines/interp";
import { sleepf } from "../../../lib/game-engine/routines/sleep";
import { ZIndex } from "../../core/scene/z-index";
import { mxnDestroyAfterSteps } from "../../mixins/mxn-destroy-after-steps";
import { mxnPhysics } from "../../mixins/mxn-physics";
import { RpgAttack } from "../../rpg/rpg-attack";
import { objFxFizzle } from "../effects/obj-fx-fizzle";
import { objProjectileCrackedEarthExpanding } from "./obj-projectile-cracked-earth-expanding";

const atkBurn = RpgAttack.create({
    conditions: {
        overheat: {
            damage: 99,
            value: 2,
        },
    },
});

export function objProjectileHotPineCone() {
    let spawned = false;

    return Sprite.from(Tx.Effects.HotPineCone)
        .mixin(mxnPhysics, { gravity: 0.2, physicsRadius: 5 })
        .pivoted(11, 16)
        .handles("moved", (self, event) => {
            if (!spawned && event.hitGround) {
                spawned = true;
                objProjectileCrackedEarthExpanding(
                    { attack: atkBurn, expandDirection: "both", expandSpeed: 5, maxWidth: 96 },
                )
                    .at(self)
                    .zIndexed(ZIndex.TerrainDecals)
                    .mixin(mxnDestroyAfterSteps, 4 * 60)
                    .show();

                objFxFizzle()
                    .tinted(0xAA0000)
                    .coro(function* (self) {
                        yield interpc(self, "tint").steps(3).to(0xEFE800).over(500);
                    })
                    .at(self)
                    .show();

                self.coro(function* () {
                    yield sleepf(2);
                    self.destroy();
                });
            }
        });
}
