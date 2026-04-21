import { Integer } from "../../../lib/math/number-alias-types";
import { Rpg } from "../rpg";
import { RpgMicrocosm } from "../rpg-microcosm";

export class MicrocosmTimeDroppedLoot extends RpgMicrocosm<MicrocosmTimeDroppedLoot.State> {
    constructor(private readonly _config: MicrocosmTimeDroppedLoot.Config) {
        super();
    }

    get lootDropsUntilActive() {
        if (this._state.activeAfterTimesDroppedLoot === null) {
            return 999;
        }

        return Rpg.records.timesDroppedLoot - this._state.activeAfterTimesDroppedLoot;
    }

    checkIsActive() {
        if (this._state.activeAfterTimesDroppedLoot === null) {
            this.reset();
            return false;
        }

        return Rpg.records.timesDroppedLoot >= this._state.activeAfterTimesDroppedLoot;
    }

    reset() {
        this._state.activeAfterTimesDroppedLoot = Rpg.records.timesDroppedLoot
            + this._config.replenishFn(this._state.activeAfterTimesDroppedLoot);
    }

    protected createState(): MicrocosmTimeDroppedLoot.State {
        return {
            activeAfterTimesDroppedLoot: null,
        };
    }
}

namespace MicrocosmTimeDroppedLoot {
    export interface State {
        activeAfterTimesDroppedLoot: Integer | null;
    }

    export interface Config {
        replenishFn: (previous: Integer | null) => Integer;
    }
}
