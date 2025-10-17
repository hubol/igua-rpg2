import { Integer } from "../../lib/math/number-alias-types";
import { RpgEconomy } from "./rpg-economy";

export class RpgLooseValuables {
    constructor(private readonly _state: RpgLooseValuables.State) {
    }

    static createState(): RpgLooseValuables.State {
        return {
            allTimeCollectionCounts: {},
            thisLifetimeCollections: new Set(),
        };
    }

    collect(uid: Integer) {
        this._state.allTimeCollectionCounts[uid] = (this._state.allTimeCollectionCounts[uid] ?? 0) + 1;
        this._state.thisLifetimeCollections.add(uid);
    }

    nextLifetime() {
        this._state.thisLifetimeCollections.clear();
    }

    trySpawn(uid: Integer, kind: RpgEconomy.Valuables.Kind) {
        if (this._state.thisLifetimeCollections.has(uid)) {
            return null;
        }

        const collectedCount = this._state.allTimeCollectionCounts[uid] ?? 0;
        const index = RpgEconomy.Valuables.DescendingTypes.indexOf(kind) + collectedCount;
        return RpgEconomy.Valuables.DescendingTypes[index] ?? null;
    }
}

namespace RpgLooseValuables {
    export interface State {
        allTimeCollectionCounts: Record<Integer, Integer>;
        thisLifetimeCollections: Set<Integer>;
    }
}
