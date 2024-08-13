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
            return RpgStatus.Methods.damage(args.status, args.effects, attack);
        },
        heal(amount: number) {
            RpgStatus.Methods.heal(args.status, args.effects, amount);
        },
    })
    .step(() => {
        RpgStatus.Methods.tick(args.status, args.effects, tickCount = (tickCount + 1) % 120);
        obj.visible = args.status.invulnerable > 0 ? !obj.visible : true;
    })

    return rpgStatusObj;
}