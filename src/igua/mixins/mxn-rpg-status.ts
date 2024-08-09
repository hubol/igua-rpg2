import { DisplayObject } from "pixi.js";
import { RpgStatus } from "../rpg/rpg-status";

export function mxnRpgStatus(obj: DisplayObject, status: RpgStatus.Model, effects: RpgStatus.Effects) {
    let tickCount = 0;

    const rpgStatusObj = obj.merge({
        status,
        damage(amount: number) {
            RpgStatus.Methods.damage(status, effects, amount);
            // TODO feels weird, should maybe be part of return value of damage?
            if (status.health === 0)
                rpgStatusObj.dispatch('rpgStatus.died');
        },
        heal(amount: number) {
            RpgStatus.Methods.heal(status, effects, amount);
        },
        poison(amount: number) {
            RpgStatus.Methods.poison(status, effects, amount);
        }
    })
    .dispatches<'rpgStatus.died'>()
    .step(() => {
        RpgStatus.Methods.tick(status, effects, tickCount = (tickCount + 1) % 120);
        obj.visible = status.invulnerable > 0 ? !obj.visible : true;
    })

    return rpgStatusObj;
}