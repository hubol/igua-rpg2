import { Sprite } from "pixi.js";
import { Sfx } from "../../../assets/sounds";
import { Tx } from "../../../assets/textures";
import { sleepf } from "../../../lib/game-engine/routines/sleep";
import { vnew } from "../../../lib/math/vector-type";
import { mxnDestroyAfterSteps } from "../../mixins/mxn-destroy-after-steps";
import { mxnPhysics } from "../../mixins/mxn-physics";
import { MxnRpgAttackArgs } from "../../mixins/mxn-rpg-attack";
import { objPuddle } from "../nature/obj-puddle";
import { StepOrder } from "../step-order";
import { objGroundExpanding } from "../utils/obj-ground-expanding";

interface ObjProjectilePuddleDripArgs extends MxnRpgAttackArgs {
}

const n = vnew();

export function objProjectilePuddleDrip(args: ObjProjectilePuddleDripArgs) {
    const tint = args.attack.conditions.wetness.tint;

    return Sprite.from(Tx.Enemy.Boyfriends.Drip)
        .tinted(tint)
        .anchored(0.5, 0.75)
        .mixin(mxnPhysics, { physicsRadius: 6, gravity: 0.3 })
        .step(self => {
            if (self.isOnGround) {
                self.angle = 0;
                return;
            }

            if (self.speed.isZero) {
                return;
            }

            n.at(self.speed).normalize();

            if (n.y < -0.8) {
                self.angle = 180;
            }
            else if (n.y > 0.8) {
                self.angle = 0;
            }
            else if (Math.abs(n.y) < 0.2) {
                self.angle = n.x > 0 ? -90 : 90;
            }
        }, StepOrder.AfterPhysics)
        .coro(function* (self) {
            yield () => self.isOnGround;

            self.speed.x = 0;

            self.play(Sfx.Enemy.Boyfriends.DripLand.rate(0.9, 1.1));

            const expandingObj = objGroundExpanding({ expandDirection: "both", expandSpeed: 8, maxWidth: 32 })
                .at(self)
                .show();

            yield sleepf(6);

            const width = expandingObj.objGroundExpanding.width;
            if (width >= 8) {
                objPuddle.objPuddleBase(
                    width,
                    6,
                    tint,
                    args.attack,
                    args.attacker,
                )
                    .at(expandingObj.objGroundExpanding.position)
                    .mixin(mxnDestroyAfterSteps, 120)
                    .show();
            }

            self.destroy();
        });
}
