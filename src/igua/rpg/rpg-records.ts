import { Integer } from "../../lib/math/number-alias-types";
import { RpgPlayer } from "./rpg-player";
import { RpgRegion } from "./rpg-region";

export class RpgRecords {
    constructor(
        private readonly _state: RpgRecords.State,
        private readonly _player: RpgPlayer,
    ) {
    }

    get gameTicksPlayed() {
        return this._state.gameTicksPlayed;
    }

    get timesDroppedLoot() {
        return this._state.timesDroppedLoot;
    }

    onDropLoot() {
        this._state.timesDroppedLoot[this._player.position.currentRegionId]++;
    }

    onPlayfulGameTick() {
        this._state.gameTicksPlayed++;
    }

    static createState(): RpgRecords.State {
        return {
            gameTicksPlayed: 0,
            timesDroppedLoot: {
                BetweenIndianaOhio: 0,
                Illinois: 0,
                Indiana: 0,
                Iowa: 0,
                Ohio: 0,
                OuterSpace: 0,
            },
        };
    }
}

export namespace RpgRecords {
    export interface State {
        gameTicksPlayed: Integer;
        timesDroppedLoot: Record<RpgRegion.Id, Integer>;
    }
}
