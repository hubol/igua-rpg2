import { Integer } from "../../../lib/math/number-alias-types";
import { Rpg } from "../rpg";
import { RpgMicrocosm } from "../rpg-microcosm";
import { RpgRegion } from "../rpg-region";

export class MicrocosmTimeDroppedLoot<T extends MicrocosmTimeDroppedLoot.State = MicrocosmTimeDroppedLoot.State>
    extends RpgMicrocosm<T>
{
    constructor(private readonly _config: MicrocosmTimeDroppedLoot.Config) {
        super();
    }

    get lootDropsUntilActive() {
        if (this._state.activeAfterTimesDroppedLoot === null) {
            return 999;
        }

        return Rpg.records.timesDroppedLoot[this._config.regionId] - this._state.activeAfterTimesDroppedLoot;
    }

    checkIsActive() {
        if (this._state.activeAfterTimesDroppedLoot === null) {
            this.reset();
            return false;
        }

        return Rpg.records.timesDroppedLoot[this._config.regionId] >= this._state.activeAfterTimesDroppedLoot;
    }

    reset() {
        this._state.activeAfterTimesDroppedLoot = Rpg.records.timesDroppedLoot[this._config.regionId]
            + this._config.replenishFn(this._state.activeAfterTimesDroppedLoot);
    }

    protected createState(): T {
        return {
            activeAfterTimesDroppedLoot: null,
        } as T;
    }
}

export namespace MicrocosmTimeDroppedLoot {
    export interface State {
        activeAfterTimesDroppedLoot: Integer | null;
    }

    export interface Config {
        regionId: RpgRegion.Id;
        replenishFn: (previous: Integer | null) => Integer;
    }
}
