import { DisplayObject } from "pixi.js";
import { Instances } from "../../lib/game-engine/instances";
import { mxnRpgStatus } from "./mxn-rpg-status";
import { RpgAttack } from "../rpg/rpg-attack";
import { RpgStatus } from "../rpg/rpg-status";

interface MxnRpgAttackArgs {
    attack: RpgAttack.Model;
    attacker?: RpgStatus.Model;
}

export function mxnRpgAttack(obj: DisplayObject, args: MxnRpgAttackArgs) {
    return obj
        .dispatches<"mxnRpgAttack.hit">()
        .merge({ isAttackActive: true })
        .step(self => {
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
