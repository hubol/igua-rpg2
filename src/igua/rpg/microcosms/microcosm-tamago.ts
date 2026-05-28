import { Integer } from "../../../lib/math/number-alias-types";
import { RpgMicrocosm } from "../rpg-microcosm";

export class MicrocosmTamago extends RpgMicrocosm<MicrocosmTamago.State> {
    constructor(private readonly _config: MicrocosmTamago.Config) {
        super();
    }

    checkEat(): MicrocosmTamago.CheckEat {
        if (this._state.inventory.food < 1) {
            return { success: false, reason: "no_food" };
        }
        if (this._state.poop > 0) {
            return { success: false, reason: "poop" };
        }
        return { success: true };
    }

    checkWash(): MicrocosmTamago.CheckWash {
        if (this._state.inventory.water < 1) {
            return { success: false, reason: "no_water" };
        }
        return { success: true };
    }

    eat() {
        this._state.inventory.food = Math.max(0, this._state.inventory.food - 1);
        this._state.stomach = Math.min(4, this._state.stomach + 1);
    }

    wash() {
        this._state.inventory.water = Math.max(0, this._state.inventory.water - 1);
        this._state.poop = 0;
    }

    upload(id: MicrocosmTamago.TamaItemId): Integer {
        return ++this._state.inventory[id];
    }

    get mood() {
        return this._state.mood;
    }

    get poopsCount() {
        return this._state.poop;
    }

    get stomach() {
        return this._state.stomach;
    }

    protected createState(): MicrocosmTamago.State {
        return {
            mood: 0,
            poop: 4,
            stomach: 0,
            inventory: {
                food: 0,
                water: 0,
            },
        };
    }
}

export namespace MicrocosmTamago {
    export interface State {
        stomach: Integer;
        mood: Integer;
        poop: Integer;
        inventory: Record<TamaItemId, Integer>;
    }

    export interface Config {
    }

    export type TamaItemId = "food" | "water";

    type Check<T extends string> =
        | { success: true }
        | { success: false; reason: T };

    export type CheckEat = Check<"no_food" | "poop">;
    export type CheckWash = Check<"no_water">;
}
