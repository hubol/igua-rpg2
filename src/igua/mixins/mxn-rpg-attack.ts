import { DisplayObject } from "pixi.js";
import { Instances } from "../../lib/game-engine/instances";
import { RpgAttack } from "../rpg/rpg-attack";
import { RpgStatus } from "../rpg/rpg-status";
import { mxnDestroyOnStatusDeath } from "./mxn-destroy-on-status-death";
import { mxnRpgStatus } from "./mxn-rpg-status";
import { mxnRpgStatusBodyPart } from "./mxn-rpg-status-body-part";

export interface MxnRpgAttackArgs {
    attack: RpgAttack.Model;
    attacker?: RpgStatus.Model;
    damageTargetsOnce?: boolean;
    damageTargetsContext?: Set<RpgStatus.Model>;
}

export function mxnRpgAttack(
    obj: DisplayObject,
    {
        attack,
        attacker,
        damageTargetsOnce = false,
        damageTargetsContext = mxnRpgAttack.createDamageTargetsContext(),
    }: MxnRpgAttackArgs,
) {
    if (attacker) {
        obj.mixin(mxnDestroyOnStatusDeath, attacker);
    }

    return obj
        .dispatches<"mxnRpgAttack.hit">()
        .merge({ attack, isAttackActive: true })
        .track(mxnRpgAttack)
        .step(self => {
            if (!self.isAttackActive) {
                return;
            }

            // TODO filter by faction here pls
            for (const instance of Instances(mxnRpgStatus)) {
                if (damageTargetsOnce && damageTargetsContext.has(instance.status)) {
                    continue;
                }
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
                        damageTargetsContext.add(instance.status);
                        self.dispatch("mxnRpgAttack.hit");
                    }
                    if (self.destroyed) {
                        return;
                    }
                }
            }
        });
}

mxnRpgAttack.createDamageTargetsContext = function createDamageTargetsContext () {
    return new Set<RpgStatus.Model>();
};
