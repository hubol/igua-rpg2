import { DataQuestReward } from "../../data/data-quest-reward";
import { Rpg } from "../rpg";
import { RpgMicrocosm } from "../rpg-microcosm";

export class MicrocosmSimpleBot extends RpgMicrocosm<MicrocosmSimpleBot.State> {
    constructor(private readonly _config: MicrocosmSimpleBot.Config) {
        super();
    }

    getQuestIdForPocketItem(id: MicrocosmSimpleBot.PocketItemId): DataQuestReward.Id {
        return this._config.questIds[id];
    }

    get hairClumpsCount() {
        return Math.min(2, Rpg.quest(this._config.questIds["RobotHair"]).timesCompleted);
    }

    protected createState(): MicrocosmSimpleBot.State {
        return {};
    }
}

namespace MicrocosmSimpleBot {
    export type PocketItemId = "RobotHair";

    export interface State {
    }

    export interface Config {
        questIds: Record<PocketItemId, DataQuestReward.Id>;
    }
}
