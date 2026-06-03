import { Sprite } from "pixi.js";
import { Tx } from "../../../assets/textures";
import { sleep } from "../../../lib/game-engine/routines/sleep";
import { Rng } from "../../../lib/math/rng";
import { VectorSimple, vnew } from "../../../lib/math/vector-type";
import { ZIndex } from "../../core/scene/z-index";
import { mxnBoilFlipH } from "../../mixins/mxn-boil-flip-h";
import { mxnDestroyOnStatusDeath } from "../../mixins/mxn-destroy-on-status-death";
import { MxnRpgAttackArgs } from "../../mixins/mxn-rpg-attack";
import { mxnSinePivot } from "../../mixins/mxn-sine-pivot";
import { StepOrder } from "../step-order";
import { objProjectilePuddleDrip } from "./obj-projectile-puddle-drip";

interface ObjProjectileSadCloudArgs extends MxnRpgAttackArgs {
    target: { position: VectorSimple };
}

export function objProjectileSadCloud(args: ObjProjectileSadCloudArgs) {
    const api = {
        dripsCount: 0,
    };

    return Sprite.from(Tx.Enemy.Chill.SadCloud)
        .mixin(mxnSinePivot)
        .mixin(mxnBoilFlipH)
        .anchored(0.5, 0.5)
        .merge({ objProjectileSadCloud: api })
        .step(
            self => self.moveTowards(getTargetPosition(args.target.position), 8),
            StepOrder.AfterPhysics,
        )
        .coro(function* (self) {
            if (args.attacker) {
                self.mixin(mxnDestroyOnStatusDeath, args.attacker);
            }
            yield sleep(500);
            while (true) {
                api.dripsCount++;
                objProjectilePuddleDrip(args)
                    .at(self)
                    .add(Rng.intc(-16, 16), 15)
                    .zIndexed(ZIndex.FrontDecals)
                    .show();
                yield sleep(200);
            }
        })
        .zIndexed(ZIndex.EnemyDeathBursts)
        .show();
}

const v = vnew();

function getTargetPosition(position: VectorSimple) {
    return v.at(position).add(0, -90);
}
