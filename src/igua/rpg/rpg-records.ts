import { Integer } from "../../lib/math/number-alias-types";

export class RpgRecords {
    constructor(private readonly _state: RpgRecords.State) {
    }

    get gameTicksPlayed() {
        return this._state.gameTicksPlayed;
    }

    get timesDroppedLoot() {
        return this._state.timesDroppedLoot;
    }

    onDropLoot() {
        this._state.timesDroppedLoot++;
    }

    onPlayfulGameTick() {
        this._state.gameTicksPlayed++;
    }

    static createState(): RpgRecords.State {
        return {
            gameTicksPlayed: 0,
            timesDroppedLoot: 0,
        };
    }
}

export namespace RpgRecords {
    export interface State {
        gameTicksPlayed: Integer;
        timesDroppedLoot: Integer;
    }
}
