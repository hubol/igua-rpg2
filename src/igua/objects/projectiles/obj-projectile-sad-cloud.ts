import { Sprite } from "pixi.js";
import { Tx } from "../../../assets/textures";
import { interp, interpvr } from "../../../lib/game-engine/routines/interp";
import { sleep } from "../../../lib/game-engine/routines/sleep";
import { Rng } from "../../../lib/math/rng";
import { VectorSimple, vnew } from "../../../lib/math/vector-type";
import { container } from "../../../lib/pixi/container";
import { ZIndex } from "../../core/scene/z-index";
import { mxnFxSpawnMany } from "../../mixins/effects/mxn-fx-spawn-many";
import { mxnDestroyOnStatusDeath } from "../../mixins/mxn-destroy-on-status-death";
import { MxnRpgAttackArgs } from "../../mixins/mxn-rpg-attack";
import { mxnSinePivot } from "../../mixins/mxn-sine-pivot";
import { StepOrder } from "../step-order";
import { objIndexedSprite } from "../utils/obj-indexed-sprite";
import { objProjectilePuddleDrip } from "./obj-projectile-puddle-drip";

const txsFace = Tx.Enemy.Chill.SadCloudFace.split({ width: 72 });

interface ObjProjectileSadCloudArgs extends MxnRpgAttackArgs {
    target: { position: VectorSimple };
}

export function objProjectileSadCloud(args: ObjProjectileSadCloudArgs) {
    const api = {
        dripsCount: 0,
    };

    const faceObj = objIndexedSprite(txsFace, txsFace.length - 1);
    faceObj.alpha = 0;

    return container(
        Sprite.from(Tx.Enemy.Chill.SadCloudBody)
            .mixin(mxnSinePivot),
        faceObj,
    )
        .mixin(mxnFxSpawnMany, { perFrame: 0.2, spawnObj: objFxSadCloudPuff })
        .pivoted(36, 12)
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
            faceObj.alpha = 0.5;
            yield sleep(250);
            faceObj.alpha = 1;
            yield sleep(250);
            yield interp(faceObj, "textureIndex").to(0).over(500);
            yield sleep(500);
            while (true) {
                api.dripsCount++;
                objProjectilePuddleDrip(args)
                    .at(self)
                    .add(0, 15)
                    .zIndexed(ZIndex.FrontDecals)
                    .show();
                yield sleep(200);
            }
        })
        .zIndexed(ZIndex.EnemyDeathBursts)
        .show();
}

function objFxSadCloudPuff() {
    return Sprite.from(Tx.Enemy.Chill.SadCloudPuff)
        .anchored(0.5, 0.5)
        .coro(function* (self) {
            yield interpvr(self).translate(Rng.vunit().scale(8).vround()).over(300);
            self.alpha = 0.5;
            yield sleep(200);
            self.destroy();
        });
}

const v = vnew();

function getTargetPosition(position: VectorSimple) {
    return v.at(position).add(0, -90);
}
