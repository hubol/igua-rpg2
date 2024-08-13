import { DisplayObject } from "pixi.js";
import { RpgStatus } from "../rpg/rpg-status";
import { RpgAttack } from "../rpg/rpg-attack";

interface MxnRpgStatusArgs {
    status: RpgStatus.Model;
    effects: RpgStatus.Effects;
    hurtboxes: DisplayObject[];
}

export function mxnRpgStatus(obj: DisplayObject, args: MxnRpgStatusArgs) {
    let tickCount = 0;

    const rpgStatusObj = obj
    .track(mxnRpgStatus)
    .merge({ hurtboxes: args.hurtboxes })
    .merge({
        damage(attack: RpgAttack.Model) {
            const result = RpgStatus.Methods.damage(args.status, args.effects, attack);
            // TODO feels weird, should maybe be part of return value of damage?
            // Or should be part of effects, I think!
            if (!result.rejected && result.died)
                rpgStatusObj.dispatch('rpgStatus.died');

            return result;
        },
        heal(amount: number) {
            RpgStatus.Methods.heal(args.status, args.effects, amount);
        },
    })
    .dispatches<'rpgStatus.died'>()
    .step(() => {
        RpgStatus.Methods.tick(args.status, args.effects, tickCount = (tickCount + 1) % 120);
        obj.visible = args.status.invulnerable > 0 ? !obj.visible : true;
    })

    return rpgStatusObj;
}