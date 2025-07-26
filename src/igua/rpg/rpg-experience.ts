import { Integer } from "../../lib/math/number-alias-types";

export class RpgExperience {
    static createState(): RpgExperience.State {
        return {
            combat: 0,
            computer: 0,
            gambling: 0,
            jump: 0,
            pocket: 0,
            quest: 0,
            social: 0,
        };
    }
}

export module RpgExperience {
    export interface State {
        combat: Integer;
        computer: Integer;
        gambling: Integer;
        jump: Integer;
        pocket: Integer;
        quest: Integer;
        social: Integer;
    }

    export type Id = keyof State;
}
