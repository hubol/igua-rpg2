import { DisplayObject } from "pixi.js";
import { RpgStatus } from "../rpg/rpg-status";

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
        damage(amount: number) {
            RpgStatus.Methods.damage(args.status, args.effects, amount);
            // TODO feels weird, should maybe be part of return value of damage?
            if (args.status.health === 0)
                rpgStatusObj.dispatch('rpgStatus.died');
        },
        heal(amount: number) {
            RpgStatus.Methods.heal(args.status, args.effects, amount);
        },
        poison(amount: number) {
            RpgStatus.Methods.poison(args.status, args.effects, amount);
        }
    })
    .dispatches<'rpgStatus.died'>()
    .step(() => {
        RpgStatus.Methods.tick(args.status, args.effects, tickCount = (tickCount + 1) % 120);
        obj.visible = args.status.invulnerable > 0 ? !obj.visible : true;
    })

    return rpgStatusObj;
}