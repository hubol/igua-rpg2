import { Logger } from "../../lib/game-engine/logger";
import { Integer } from "../../lib/math/number-alias-types";
import { Empty } from "../../lib/types/empty";
import { DataEquipment, EquipmentInternalName } from "../data/data-equipment";
import { RpgEquipmentEffects } from "./rpg-equipment-effects";
import { RpgProgress } from "./rpg-progress";

export namespace RpgEquipmentLoadout {
    export type Slot = EquipmentInternalName | null;
    export type Model = [Slot, Slot, Slot, Slot];

    const effectsOrder = Empty<EquipmentInternalName>();
    const effectsBonusMap = new Map<EquipmentInternalName, Integer>();

    export function getEffects(loadout: Readonly<Model>, dest: RpgEquipmentEffects.Model) {
        RpgEquipmentEffects.clear(dest);

        effectsOrder.length = 0;
        effectsBonusMap.clear();

        for (let i = 0; i < loadout.length; i++) {
            const name = loadout[i];
            if (name === null) {
                continue;
            }

            const value = effectsBonusMap.get(name);

            if (value === undefined) {
                effectsOrder.push(name);
            }

            const nextValue = value === undefined ? 0 : (value + 1);
            effectsBonusMap.set(name, nextValue);
        }

        for (let i = 0; i < effectsOrder.length; i++) {
            const name = effectsOrder[i];
            const bonus = effectsBonusMap.get(name)!;

            if (bonus === undefined) {
                Logger.logAssertError(`RpgEquipmentLoadout.getEffects`, new Error(`Got undefined bonus`), { name });
            }

            DataEquipment[name].effects(dest, bonus);
        }
    }

    const playerEffectsCache = RpgEquipmentEffects.create();
    let isPlayerEffectsCacheValid = false;

    export function getPlayerEffects() {
        if (isPlayerEffectsCacheValid) {
            return playerEffectsCache;
        }
        getEffects(RpgProgress.character.equipment.loadout, playerEffectsCache);
        isPlayerEffectsCacheValid = true;
        return playerEffectsCache;
    }

    export function invalidatePlayerEffectsCache() {
        isPlayerEffectsCacheValid = false;
    }

    // TODO I dislike the name
    export function applyPlayer(name: EquipmentInternalName) {
        // TODO strange implementation, figure out API eventually :-)
        // const freeIndex = RpgProgress.character.equipment.loadout.indexOf(null);
        // if (freeIndex >= 0) {
        //     RpgProgress.character.equipment[freeIndex] = name;
        // }
        // else {
        //     RpgProgress.character.equipment.loadout.shift();
        //     RpgProgress.character.equipment.push(name);
        // }

        invalidatePlayerEffectsCache();
    }
}
