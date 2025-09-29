import { CacheMap } from "../../lib/object/cache-map";
import { DataFact } from "../data/data-fact";
import { RpgExperienceRewarder } from "./rpg-experience-rewarder";

export class RpgClassrooms {
    constructor(private readonly _state: RpgClassrooms.State, private readonly _reward: RpgExperienceRewarder) {
    }

    private readonly _cacheMap = new CacheMap((classroomId: string) =>
        new RpgClassroom(classroomId, this._state, this._reward)
    );

    readonly getById = this._cacheMap.get.bind(this._cacheMap);

    static createState(): RpgClassrooms.State {
        return { taughtFacts: {} };
    }
}

export namespace RpgClassrooms {
    export interface State {
        // TODO maybe someday more strict than string?
        taughtFacts: Record<string, Set<DataFact.Id>>;
    }
}

class RpgClassroom {
    constructor(
        private readonly _id: string,
        private readonly _state: RpgClassrooms.State,
        private readonly _reward: RpgExperienceRewarder,
    ) {
    }

    private get _taughtFacts() {
        const taughtFacts = this._state.taughtFacts[this._id];
        if (taughtFacts) {
            return taughtFacts;
        }
        return this._state.taughtFacts[this._id] = new Set();
    }

    canAnyBeTaught(factIds: ReadonlySet<DataFact.Id>) {
        for (const factId of factIds) {
            if (!this._taughtFacts.has(factId)) {
                return true;
            }
        }

        return false;
    }

    teach(factId: DataFact.Id): RpgClassroom.TeachResult {
        if (this._taughtFacts.has(factId)) {
            return { accepted: false, reason: "already_taught" };
        }

        this._taughtFacts.add(factId);
        this._reward.social.onTeachFactToClassroom();
        return { accepted: true };
    }
}

namespace RpgClassroom {
    export type TeachResult = TeachResult.Accepted | TeachResult.Rejected;
    export namespace TeachResult {
        export interface Accepted {
            accepted: true;
        }

        export interface Rejected {
            accepted: false;
            reason: "already_taught";
        }
    }
}
