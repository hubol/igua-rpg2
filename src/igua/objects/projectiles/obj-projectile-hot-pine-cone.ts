import { Sprite } from "pixi.js";
import { Tx } from "../../../assets/textures";
import { interpc } from "../../../lib/game-engine/routines/interp";
import { sleepf } from "../../../lib/game-engine/routines/sleep";
import { Integer } from "../../../lib/math/number-alias-types";
import { ZIndex } from "../../core/scene/z-index";
import { mxnDestroyAfterSteps } from "../../mixins/mxn-destroy-after-steps";
import { mxnPhysics } from "../../mixins/mxn-physics";
import { MxnRpgAttackArgs } from "../../mixins/mxn-rpg-attack";
import { RpgAttack } from "../../rpg/rpg-attack";
import { RpgFaction } from "../../rpg/rpg-faction";
import { objFxFizzle } from "../effects/obj-fx-fizzle";
import { objProjectileCrackedEarthExpanding } from "./obj-projectile-cracked-earth-expanding";

const atkBurn = RpgAttack.create({
    conditions: {
        overheat: {
            damage: 99,
            value: 1,
        },
    },
    versus: RpgFaction.Anyone,
});

interface ObjProjectileHotPineConeArgs extends Partial<MxnRpgAttackArgs> {
    destroyAfterStepsCount?: Integer;
}

export function objProjectileHotPineCone(args: ObjProjectileHotPineConeArgs = {}) {
    let spawned = false;

    return Sprite.from(Tx.Effects.HotPineCone)
        .mixin(mxnPhysics, { gravity: 0.2, physicsRadius: 5 })
        .pivoted(11, 16)
        .handles("moved", (self, event) => {
            if (!spawned && event.hitGround) {
                spawned = true;
                objProjectileCrackedEarthExpanding(
                    {
                        attack: args.attack ?? atkBurn,
                        attacker: args.attacker,
                        expandDirection: "both",
                        expandSpeed: 5,
                        maxWidth: 96,
                    },
                )
                    .at(self)
                    .zIndexed(ZIndex.TerrainDecals)
                    .mixin(mxnDestroyAfterSteps, args.destroyAfterStepsCount ?? 3 * 60)
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
