import { DisplayObject } from "pixi.js";
import { Instances } from "../../lib/game-engine/instances";
import { RpgAttack } from "../rpg/rpg-attack";
import { RpgStatus } from "../rpg/rpg-status";
import { mxnDestroyOnStatusDeath } from "./mxn-destroy-on-status-death";
import { mxnRpgStatus } from "./mxn-rpg-status";
import { mxnRpgStatusBodyPart } from "./mxn-rpg-status-body-part";

interface MxnRpgAttackArgs {
    attack: RpgAttack.Model;
    attacker?: RpgStatus.Model;
}

export function mxnRpgAttack(obj: DisplayObject, { attack, attacker }: MxnRpgAttackArgs) {
    if (attacker) {
        obj.mixin(mxnDestroyOnStatusDeath, attacker);
    }

    return obj
        .dispatches<"mxnRpgAttack.hit">()
        .merge({ attack, isAttackActive: true })
        .step(self => {
            if (!self.isAttackActive) {
                return;
            }

            // TODO filter by faction here pls
            for (const instance of Instances(mxnRpgStatus)) {
                const hurtboxObj = obj.collidesOne(instance.hurtboxes);
                if (hurtboxObj) {
                    // TODO this is copy-pasted in player
                    const result = instance.damage(self.attack, {
                        attacker,
                        bodyPart: hurtboxObj.is(mxnRpgStatusBodyPart)
                            ? hurtboxObj.mxnRpgStatusBodyPart.model
                            : undefined,
                    });
                    if (!result.rejected) {
                        self.dispatch("mxnRpgAttack.hit");
                    }
                    if (self.destroyed) {
                        return;
                    }
                }
            }
        });
}
