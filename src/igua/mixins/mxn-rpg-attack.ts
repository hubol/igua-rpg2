import { DisplayObject } from "pixi.js";
import { Instances } from "../../lib/game-engine/instances";
import { objFxOwnerDefeat } from "../objects/effects/obj-fx-owner-defeat";
import { RpgAttack } from "../rpg/rpg-attack";
import { RpgStatus } from "../rpg/rpg-status";
import { mxnRpgStatus } from "./mxn-rpg-status";

interface MxnRpgAttackArgs {
    attack: RpgAttack.Model;
    attacker?: RpgStatus.Model;
}

export function mxnRpgAttack(obj: DisplayObject, args: MxnRpgAttackArgs) {
    return obj
        .dispatches<"mxnRpgAttack.hit">()
        .merge({ isAttackActive: true })
        .step(self => {
            if (args.attacker && args.attacker.health <= 0) {
                objFxOwnerDefeat().at(self.getWorldPosition()).show();
                self.destroy();
                return;
            }

            if (!self.isAttackActive) {
                return;
            }

            for (const instance of Instances(mxnRpgStatus)) {
                // TODO filter by faction here pls
                if (obj.collidesOne(instance.hurtboxes)) {
                    const result = instance.damage(args.attack, args.attacker);
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
