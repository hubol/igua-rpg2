import { RpgPlayer } from "./rpg-player";

export class RpgDifficulty {
    constructor(private readonly _player: RpgPlayer) {
    }

    get level() {
        return this._player.previousAdventuresCount * 3;
    }
}
