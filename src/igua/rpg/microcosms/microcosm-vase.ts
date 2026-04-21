import { Integer } from "../../../lib/math/number-alias-types";
import { RpgMicrocosm } from "../rpg-microcosm";

// TODO I would like this to work differently
// Perhaps flags expose their own API
const consts = {
    maxVaseMoistureUnits: 1000,
};

export class MicrocosmVase extends RpgMicrocosm<MicrocosmVase.State> {
    get fillUnit() {
        return Math.max(0, Math.min(1, this._state.moistureUnits / consts.maxVaseMoistureUnits));
    }

    get isFilled() {
        return this.fillUnit >= 1;
    }

    fill(units: Integer) {
        this._state.moistureUnits = Math.min(this._state.moistureUnits + units, consts.maxVaseMoistureUnits);
    }

    createState(): MicrocosmVase.State {
        return {
            moistureUnits: 0,
        };
    }
}

namespace MicrocosmVase {
    export interface State {
        moistureUnits: Integer;
    }
}
