import { Integer } from "../../lib/math/number-alias-types";
import { isNotNullish } from "../../lib/types/guards/is-not-nullish";
import { DataEquipment } from "../data/data-equipment";
import { DataItem } from "../data/data-item";
import { Rpg } from "../rpg/rpg";
import { RpgCharacterEquipment } from "../rpg/rpg-character-equipment";
import { DramaItem } from "./drama-item";
import { show } from "./show";

function* upgrade() {
    const hasGlue = Rpg.inventory.count({ kind: "key_item", id: "EquipmentGlue" }) >= 1;
    const upgradeableEquipments = findUpgradeableEquipments(Rpg.inventory.equipment);

    const hasUpgradeableEquipments = upgradeableEquipments.length > 0;

    if (!hasGlue && !hasUpgradeableEquipments) {
        yield* show("Sorry!\nTo upgrade shoes, Shoe Glue and two shoes of the same type are required.");
        return;
    }
    if (!hasGlue) {
        yield* show("Sorry!\nTo upgrade shoes, Shoe Glue is required.");
        return;
    }
    if (!hasUpgradeableEquipments) {
        yield* show("Sorry!\nTo upgrade shoes, two shoes of the same type are required.");
        return;
    }

    const options = upgradeableEquipments.map(
        ({ equipmentId, resultingLevel, obtainedEquipments: [equipment0, equipment1] }) => {
            const item = { kind: "equipment" as const, level: resultingLevel, id: equipmentId };
            const message = `I'll make a ${
                DataItem.getName(item)
            }\nby combining your Lvl ${equipment0.level} and Lvl ${equipment1.level} with Shoe Glue`;
            return ({
                item,
                message,
            });
        },
    );

    const item = yield* DramaItem.choose({
        message: "Which shoes to upgrade?",
        noneMessage: "Uhhh... nevermind",
        options,
    });

    if (item === null) {
        return;
    }
}

interface UpgradeableEquipment {
    equipmentId: DataEquipment.Id;
    obtainedEquipments: [RpgCharacterEquipment.ObtainedEquipment, RpgCharacterEquipment.ObtainedEquipment];
    resultingLevel: Integer;
    areEitherEquipped: boolean;
}

function toUpgradeableEquipment(
    equipmentId: DataEquipment.Id,
    obtainedEquipments: Array<RpgCharacterEquipment.ObtainedEquipment>,
): UpgradeableEquipment | null {
    if (obtainedEquipments.length < 2) {
        return null;
    }

    const [equipment0, equipment1] = [...obtainedEquipments].sort((a, b) => b.level - a.level);

    return {
        equipmentId,
        obtainedEquipments: [equipment0, equipment1],
        areEitherEquipped: equipment0.loadoutIndex !== null
            || equipment1.loadoutIndex !== null,
        resultingLevel: equipment0.level + equipment1.level,
    };
}

function findUpgradeableEquipments(characterEquipment: RpgCharacterEquipment): Array<UpgradeableEquipment> {
    const obtainedEquipmentsByEquipmentId: Partial<
        Record<
            DataEquipment.Id,
            Array<RpgCharacterEquipment.ObtainedEquipment>
        >
    > = {};

    for (const obtainedEquipment of characterEquipment.list) {
        const array = obtainedEquipmentsByEquipmentId[obtainedEquipment.equipmentId];
        if (!array) {
            obtainedEquipmentsByEquipmentId[obtainedEquipment.equipmentId] = [obtainedEquipment];
        }
        else {
            array.push(obtainedEquipment);
        }
    }

    return Object.entries(obtainedEquipmentsByEquipmentId)
        .map(([equipmentId, obtainedEquipments]) =>
            toUpgradeableEquipment(equipmentId as DataEquipment.Id, obtainedEquipments)
        )
        .filter(isNotNullish);
}

export const DramaEquipment = {
    upgrade,
};
