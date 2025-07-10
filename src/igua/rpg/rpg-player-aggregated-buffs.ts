import { SceneLocal } from "../../lib/game-engine/scene-local";
import { Integer } from "../../lib/math/number-alias-types";
import { clone } from "../../lib/object/clone";
import { Null } from "../../lib/types/null";
import { RpgCharacterEquipment } from "./rpg-character-equipment";
import { RpgPlayerBuffs } from "./rpg-player-buffs";

export const RpgScenePlayerBuffsMutator = new SceneLocal<{ mutatorFn: RpgPlayerBuffs.MutatorFn }>(
    () => ({ mutatorFn: RpgPlayerBuffs.voidMutator }),
    "RpgPlayerSceneBuffsMutator",
);

function getSceneMutatorFn() {
    try {
        return RpgScenePlayerBuffsMutator.value.mutatorFn;
    }
    catch (e) {
        // TODO  a bad sign to have an expected error like this
        // I think this can be resolved if the world buffs are stored in rpgprogressdata somehow!
        return RpgPlayerBuffs.voidMutator;
    }
}

export class RpgPlayerAggregatedBuffs {
    constructor(private readonly _equipment: RpgCharacterEquipment) {
    }

    private _cachedBuffs: RpgPlayerBuffs.Model | null = null;

    getAggregatedBuffs(): Readonly<RpgPlayerBuffs.Model> {
        const sceneMutatorFn = getSceneMutatorFn();
        const loadoutUpdatesCount = this._equipment.loadoutUpdatesCount;

        if (
            !this._cachedBuffs
            || this._cacheKeys.loadoutUpdatesCount !== loadoutUpdatesCount
            || this._cacheKeys.sceneMutatorFn !== sceneMutatorFn
        ) {
            const loadoutBuffs = clone(this._equipment.loadoutBuffs);
            sceneMutatorFn(loadoutBuffs, 0);

            this._cachedBuffs = loadoutBuffs;

            this._cacheKeys.loadoutUpdatesCount = loadoutUpdatesCount;
            this._cacheKeys.sceneMutatorFn = sceneMutatorFn;
        }

        return this._cachedBuffs!;
    }

    private readonly _cacheKeys = {
        sceneMutatorFn: Null<RpgPlayerBuffs.MutatorFn>(),
        loadoutUpdatesCount: Null<Integer>(),
    };
}
