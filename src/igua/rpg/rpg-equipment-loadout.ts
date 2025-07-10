import { Logger } from "../../lib/game-engine/logger";
import { Integer } from "../../lib/math/number-alias-types";
import { Empty } from "../../lib/types/empty";
import { DataEquipment, EquipmentInternalName } from "../data/data-equipment";
import { RpgPlayerBuffs } from "./rpg-player-buffs";

export namespace RpgEquipmentLoadout {
    export type Item = EquipmentInternalName | null;
    export type Model = [Item, Item, Item, Item];

    const equipmentsOrder = Empty<EquipmentInternalName>();
    const equipmentBonusMap = new Map<EquipmentInternalName, Integer>();

    export function getPlayerBuffs(loadout: Readonly<Model>, dest: RpgPlayerBuffs.Model) {
        RpgPlayerBuffs.clear(dest);

        equipmentsOrder.length = 0;
        equipmentBonusMap.clear();

        for (let i = 0; i < loadout.length; i++) {
            const name = loadout[i];
            if (name === null) {
                continue;
            }

            const value = equipmentBonusMap.get(name);

            if (value === undefined) {
                equipmentsOrder.push(name);
            }

            const nextValue = value === undefined ? 0 : (value + 1);
            equipmentBonusMap.set(name, nextValue);
        }

        for (let i = 0; i < equipmentsOrder.length; i++) {
            const name = equipmentsOrder[i];
            const bonus = equipmentBonusMap.get(name)!;

            if (bonus === undefined) {
                Logger.logAssertError(`RpgEquipmentLoadout.getPlayerBuffs`, new Error(`Got undefined bonus`), { name });
            }

            DataEquipment[name].buffs(dest, bonus);
        }
    }
}
