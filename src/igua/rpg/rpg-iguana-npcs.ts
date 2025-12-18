import { Integer } from "../../lib/math/number-alias-types";
import { CacheMap } from "../../lib/object/cache-map";
import { CountingMap } from "../../lib/object/counting-map";
import { DataNpcPersona } from "../data/data-npc-persona";
import { RpgCutscene } from "./rpg-cutscene";
import { RpgExperienceRewarder } from "./rpg-experience-rewarder";

export class RpgIguanaNpcs {
    private readonly _cacheMap = new CacheMap((id: DataNpcPersona.Id) =>
        new RpgIguanaNpc(this._state, id, this._reward)
    );

    constructor(private readonly _state: RpgIguanaNpcs.State, private readonly _reward: RpgExperienceRewarder) {
    }

    readonly getById = this._cacheMap.get.bind(this._cacheMap);

    static createState(): RpgIguanaNpcs.State {
        return {};
    }
}

const CtxIguanaSpeakers = new RpgCutscene.Local(() => ({
    personaIdsSpoken: new CountingMap<DataNpcPersona.Id>(),
}));

class RpgIguanaNpc {
    constructor(
        private readonly _npcsState: RpgIguanaNpcs.State,
        private readonly _id: DataNpcPersona.Id,
        private readonly _reward: RpgExperienceRewarder,
    ) {
    }

    private get _state() {
        if (!this._npcsState[this._id]) {
            return this._npcsState[this._id] = { spokenToTimesCount: 0 };
        }
        return this._npcsState[this._id]!;
    }

    get id() {
        return this._id;
    }

    onSpeak() {
        const globalCount = ++this._state.spokenToTimesCount;
        const sceneCount = CtxIguanaSpeakers.value.personaIdsSpoken.increment(this._id);

        if (globalCount > 10) {
            return;
        }

        if (globalCount === 1) {
            this._reward.social.onNpcSpeak("first_ever");
        }
        else if (sceneCount === 1) {
            this._reward.social.onNpcSpeak("first_in_cutscene");
        }
        else {
            this._reward.social.onNpcSpeak("default");
        }
    }
}

namespace RpgIguanaNpcs {
    export type State = Partial<Record<DataNpcPersona.Id, RpgIguanaNpc.State>>;
}

namespace RpgIguanaNpc {
    export interface State {
        spokenToTimesCount: Integer;
    }
}
