import { DisplayObject } from "pixi.js";
import { RpgStatus } from "../rpg/rpg-status";

export function mxnRpgStatus(obj: DisplayObject, model: RpgStatus.Model, effects: RpgStatus.Effects) {
    let tickCount = 0;

    // TODO death? invulnerability (flash?)?

    return obj.merge({
        damage(amount: number) {
            RpgStatus.Methods.damage(model, effects, amount);
        },
        heal(amount: number) {
            RpgStatus.Methods.heal(model, effects, amount);
        },
        poison(amount: number) {
            RpgStatus.Methods.poison(model, effects, amount);
        }
    })
    .step(() => RpgStatus.Methods.tick(model, effects, tickCount = (tickCount + 1) % 120))
}