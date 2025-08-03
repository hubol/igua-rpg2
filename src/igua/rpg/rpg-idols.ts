import { Integer } from "../../lib/math/number-alias-types";
import { DataIdol } from "../data/data-idol";
import { RpgCutscene } from "./rpg-cutscene";
import { RpgPlayerBuffs } from "./rpg-player-buffs";

export class RpgIdols {
    private readonly _cache: Partial<Record<Integer, RpgIdol>> = {};

    constructor(private readonly _state: RpgIdols.State) {
    }

    getById(idolId: Integer) {
        const cache = this._cache[idolId];

        if (cache) {
            return cache;
        }

        const idolState = this._state[idolId] ?? (this._state[idolId] = RpgIdol.createState());
        return this._cache[idolId] = new RpgIdol(idolState);
    }

    static createState(): RpgIdols.State {
        return {};
    }
}

module RpgIdols {
    export type State = Record<Integer, RpgIdol.State>;
}

export class RpgIdol {
    constructor(private readonly _state: RpgIdol.State) {
    }

    get buffs() {
        return this.isEmpty ? RpgPlayerBuffs.voidMutator : DataIdol.getById(this.idolId!).buffs;
    }

    get health() {
        return this._state.health;
    }

    get idolId() {
        return this.isEmpty ? null : this._state.idolId!;
    }

    get isEmpty() {
        return this._state.health < 1 || !this._state.idolId;
    }

    upload(idolId: DataIdol.Id) {
        this._state.idolId = idolId;
        this._state.health = 60 * 30;
    }

    tick() {
        if (this.isEmpty || RpgCutscene.isPlaying) {
            return;
        }
        this._state.health -= 1;
    }

    static createState(): RpgIdol.State {
        return {
            health: 0,
            idolId: null,
        };
    }
}

module RpgIdol {
    export interface State {
        health: Integer;
        idolId: DataIdol.Id | null;
    }
}
