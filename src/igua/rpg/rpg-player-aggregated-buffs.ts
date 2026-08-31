import { SceneLocal } from "../../lib/game-engine/scene-local";
import { Integer } from "../../lib/math/number-alias-types";
import { clone } from "../../lib/object/clone";
import { Null } from "../../lib/types/null";
import { RpgCharacterEquipment } from "./rpg-character-equipment";
import { RpgIdol } from "./rpg-idols";
import { RpgPlayerBuffs } from "./rpg-player-buffs";
import { RpgPlayerTemporaryEffects } from "./rpg-player-temporary-effects";

export const RpgSceneIdol = new SceneLocal<{ idol: RpgIdol | null }>(
    () => ({ idol: null }),
    "RpgSceneIdol",
);

function getSceneMutatorFn() {
    try {
        const idol = RpgSceneIdol.value.idol;
        return idol?.buffs ?? RpgPlayerBuffs.voidMutator;
    }
    catch (e) {
        // TODO  a bad sign to have an expected error like this
        // I think this can be resolved if the world buffs are stored in rpgprogressdata somehow!
        return RpgPlayerBuffs.voidMutator;
    }
}

export class RpgPlayerAggregatedBuffs {
    constructor(
        private readonly _equipment: RpgCharacterEquipment,
        private readonly _temporaryEffects: RpgPlayerTemporaryEffects,
    ) {
    }

    private _cachedBuffs: RpgPlayerBuffs.Model | null = null;

    getAggregatedBuffs(): Readonly<RpgPlayerBuffs.Model> {
        const sceneMutatorFn = getSceneMutatorFn();
        const loadoutUpdatesCount = this._equipment.loadout.updatesCount;
        const temporaryEffectsCacheKey = this._temporaryEffects.cacheKey;

        if (
            !this._cachedBuffs
            || this._cacheKeys.loadoutUpdatesCount !== loadoutUpdatesCount
            || this._cacheKeys.sceneMutatorFn !== sceneMutatorFn
            || this._cacheKeys.temporaryEffectsCacheKey !== temporaryEffectsCacheKey
        ) {
            const computedBuffs = clone(this._equipment.loadout.buffs);
            sceneMutatorFn(computedBuffs, 0);
            for (const temporaryEffectBuffsMutatorFn of this._temporaryEffects.buffs) {
                temporaryEffectBuffsMutatorFn(computedBuffs, 0);
            }

            this._cachedBuffs = computedBuffs;

            this._cacheKeys.loadoutUpdatesCount = loadoutUpdatesCount;
            this._cacheKeys.sceneMutatorFn = sceneMutatorFn;
            this._cacheKeys.temporaryEffectsCacheKey = temporaryEffectsCacheKey;
        }

        return this._cachedBuffs!;
    }

    private readonly _cacheKeys = {
        sceneMutatorFn: Null<RpgPlayerBuffs.MutatorFn>(),
        loadoutUpdatesCount: Null<Integer>(),
        temporaryEffectsCacheKey: Null<Integer>(),
    };
}
