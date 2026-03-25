import { Integer } from "../../lib/math/number-alias-types";

export class RpgRecords {
    constructor(private readonly _state: RpgRecords.State) {
    }

    get timesDroppedLoot() {
        return this._state.timesDroppedLoot;
    }

    onDropLoot() {
        this._state.timesDroppedLoot++;
    }

    static createState(): RpgRecords.State {
        return {
            timesDroppedLoot: 0,
        };
    }
}

export namespace RpgRecords {
    export interface State {
        timesDroppedLoot: Integer;
    }
}
