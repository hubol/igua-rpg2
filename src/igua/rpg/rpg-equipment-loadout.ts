import { Logger } from "../../lib/game-engine/logger";
import { Integer } from "../../lib/math/number-alias-types";
import { Empty } from "../../lib/types/empty";
import { DataEquipment } from "../data/data-equipment";
import { RpgPlayerBuffs } from "./rpg-player-buffs";

export namespace RpgEquipmentLoadout {
    export type Item = DataEquipment.Id | null;
    export type Model = [Item, Item, Item, Item];

    const equipmentsOrder = Empty<DataEquipment.Id>();
    const equipmentBonusMap = new Map<DataEquipment.Id, Integer>();

    export function getPlayerBuffs(loadout: Readonly<Model>, dest: RpgPlayerBuffs.Model) {
        RpgPlayerBuffs.clear(dest);

        equipmentsOrder.length = 0;
        equipmentBonusMap.clear();

        for (let i = 0; i < loadout.length; i++) {
            const equipmentId = loadout[i];
            if (equipmentId === null) {
                continue;
            }

            const value = equipmentBonusMap.get(equipmentId);

            if (value === undefined) {
                equipmentsOrder.push(equipmentId);
            }

            const nextValue = value === undefined ? 0 : (value + 1);
            equipmentBonusMap.set(equipmentId, nextValue);
        }

        for (let i = 0; i < equipmentsOrder.length; i++) {
            const equipmentId = equipmentsOrder[i];
            const bonus = equipmentBonusMap.get(equipmentId)!;

            if (bonus === undefined) {
                Logger.logAssertError(`RpgEquipmentLoadout.getPlayerBuffs`, new Error(`Got undefined bonus`), {
                    name: equipmentId,
                });
            }

            DataEquipment.getById(equipmentId).buffs(dest, bonus);
        }
    }
}
