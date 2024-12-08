import { DisplayObject } from "pixi.js";
import { RpgStatus } from "../rpg/rpg-status";
import { RpgAttack } from "../rpg/rpg-attack";
import { mxnDripping } from "./mxn-dripping";
import { approachLinear } from "../../lib/math/number";

interface MxnRpgStatusArgs {
    status: RpgStatus.Model;
    effects: RpgStatus.Effects;
    hurtboxes: DisplayObject[];
}

export function mxnRpgStatus(obj: DisplayObject, args: MxnRpgStatusArgs) {
    let tickCount = 0;

    const rpgStatusObj = obj
        .track(mxnRpgStatus)
        .dispatchesValue<"damaged", RpgStatus.DamageResult>()
        .mixin(mxnDripping)
        .merge(args)
        .merge({
            damage(attack: RpgAttack.Model, attacker?: RpgStatus.Model) {
                const result = RpgStatus.Methods.damage(args.status, args.effects, attack, attacker);
                rpgStatusObj.dispatch("damaged", result);
                return result;
            },
            heal(amount: number) {
                RpgStatus.Methods.heal(args.status, args.effects, amount);
            },
        })
        .step(self => {
            RpgStatus.Methods.tick(args.status, args.effects, tickCount = (tickCount + 1) % 120);
            obj.visible = args.status.invulnerable > 0 ? !obj.visible : true;
            self.dripsPerFrame = approachLinear(
                self.dripsPerFrame,
                getTargetDripsPerFrame(args.status.wetness.value),
                0.025,
            );
        });

    return rpgStatusObj;
}

export type MxnRpgStatus = ReturnType<typeof mxnRpgStatus>;

function getTargetDripsPerFrame(wetness: number) {
    if (wetness > 90) {
        return 0.25;
    }
    if (wetness > 75) {
        return 0.5;
    }
    if (wetness > 50) {
        return 0.3;
    }
    if (wetness > 25) {
        return 0.1;
    }
    if (wetness > 10) {
        return 0.05;
    }
    return 0;
}
