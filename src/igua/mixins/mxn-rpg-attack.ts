import { DisplayObject } from "pixi.js";
import { Instances } from "../../lib/game-engine/instances";
import { RpgAttack } from "../rpg/rpg-attack";
import { RpgStatus } from "../rpg/rpg-status";
import { mxnDestroyOnStatusDeath } from "./mxn-destroy-on-status-death";
import { mxnRpgStatus } from "./mxn-rpg-status";

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

            for (const instance of Instances(mxnRpgStatus)) {
                // TODO filter by faction here pls
                if (obj.collidesOne(instance.hurtboxes)) {
                    const result = instance.damage(self.attack, attacker);
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
