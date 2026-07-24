import { Integer } from "../../lib/math/number-alias-types";
import { RpgPlayer } from "./rpg-player";
import { RpgRegion } from "./rpg-region";

const regionDifficulties: Record<RpgRegion.StartingId, Record<RpgRegion.Id, Integer>> = {
    Indiana: {
        Indiana: 0,
        BetweenIndianaOhio: 1,
        Ohio: 1,
        Illinois: 2,
        Iowa: 2,
        OuterSpace: 2,
    },
    Ohio: {
        Ohio: 0,
        BetweenIndianaOhio: 1,
        Indiana: 1,
        Illinois: 2,
        Iowa: 2,
        OuterSpace: 2,
    },
};

export class RpgDifficulty {
    constructor(private readonly _player: RpgPlayer) {
    }

    get level() {
        const regionDifficulty =
            regionDifficulties[this._player.startingRegionId][this._player.position.currentRegionId];
        const newGamePlusDifficulty = this._player.previousAdventuresCount * 3;
        return regionDifficulty + newGamePlusDifficulty;
    }
}
