import { Integer } from "../../lib/math/number-alias-types";
import { CacheMap } from "../../lib/object/cache-map";
import { DataIdol } from "../data/data-idol";
import { RpgCutscene } from "./rpg-cutscene";
import { RpgPlayerBuffs } from "./rpg-player-buffs";

export class RpgIdols {
    private readonly _cacheMap = new CacheMap((idolId: Integer) => {
        const idolState = this._state[idolId] ?? (this._state[idolId] = RpgIdol.createState());
        return new RpgIdol(idolState);
    });

    constructor(private readonly _state: RpgIdols.State) {
    }

    readonly getById = this._cacheMap.get.bind(this._cacheMap);

    static createState(): RpgIdols.State {
        return {};
    }
}

namespace RpgIdols {
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

namespace RpgIdol {
    export interface State {
        health: Integer;
        idolId: DataIdol.Id | null;
    }
}
