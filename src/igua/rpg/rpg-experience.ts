import { Integer } from "../../lib/math/number-alias-types";
import { RpgExperienceRewarder } from "./rpg-experience-rewarder";

export class RpgExperience implements Readonly<RpgExperience.State> {
    constructor(private readonly _state: RpgExperience.State) {
    }

    readonly reward = new RpgExperienceRewarder(this._state);

    get combat() {
        return this._state.combat;
    }

    get computer() {
        return this._state.computer;
    }

    get gambling() {
        return this._state.gambling;
    }

    get jump() {
        return this._state.jump;
    }

    get pocket() {
        return this._state.pocket;
    }

    get quest() {
        return this._state.quest;
    }

    get social() {
        return this._state.social;
    }

    get spirit() {
        return this._state.spirit;
    }

    spend(experienceId: RpgExperience.Id, amount: Integer) {
        this._state[experienceId] = Math.max(0, this._state[experienceId] - amount);
    }

    static createState(): RpgExperience.State {
        return {
            combat: 0,
            computer: 0,
            gambling: 0,
            jump: 0,
            pocket: 0,
            quest: 0,
            social: 0,
            spirit: 0,
        };
    }
}

export namespace RpgExperience {
    export const Manifest = [
        "combat",
        "computer",
        "gambling",
        "jump",
        "pocket",
        "quest",
        "social",
        "spirit",
    ] as const;

    export type Id = typeof Manifest[number];

    export type State = Record<Id, Integer>;

    const manifestSet = new Set(Manifest);
    export function isId(value: string): value is Id {
        return manifestSet.has(value as Id);
    }
}
