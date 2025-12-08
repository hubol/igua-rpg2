import { Logger } from "../../lib/game-engine/logger";
import { isNotNullish } from "../../lib/types/guards/is-not-nullish";
import { DataEquipment } from "../data/data-equipment";
import { DataItem } from "../data/data-item";
import { Rpg } from "../rpg/rpg";
import { RpgCharacterEquipment } from "../rpg/rpg-character-equipment";
import { RpgInventory } from "../rpg/rpg-inventory";
import { DramaInventory } from "./drama-inventory";
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
        ({ resultingEquipment, obtainedEquipments: [equipment0, equipment1] }) => {
            const message = `I'll make a ${
                DataItem.getName(resultingEquipment)
            }\nby combining your Lvl ${equipment0.level} and Lvl ${equipment1.level} with Shoe Glue`;
            return ({
                item: resultingEquipment,
                message,
            });
        },
    );

    const chosenEquipment = yield* DramaItem.choose({
        message: "Which shoes to upgrade?",
        noneMessage: "Uhhh... nevermind",
        options,
    });

    if (chosenEquipment === null) {
        return;
    }

    const equipmentToUpgrade = upgradeableEquipments.find(upgradeable =>
        upgradeable.resultingEquipment === chosenEquipment
    );

    if (!equipmentToUpgrade) {
        Logger.logAssertError(
            "DramaEquipment.upgrade",
            new Error("Failed to find chosenEquipment in upgradeableEquipments"),
            { upgradeableEquipments, chosenEquipment },
        );

        return;
    }

    yield* DramaInventory.removeCount({ kind: "key_item", id: "EquipmentGlue" }, 1);

    for (const obtainedEquipment of equipmentToUpgrade.obtainedEquipments) {
        Rpg.inventory.equipment.remove(obtainedEquipment.id);
    }

    {
        const [removeItem0, removeItem1]: RpgInventory.Item.Equipment[] = equipmentToUpgrade.obtainedEquipments.map((
            { equipmentId, level },
        ) => ({ kind: "equipment", id: equipmentId, level }));
        DramaItem.createRemovedItemFigureObjAtPlayer(removeItem0);
        yield DramaItem.sleepAfterRemoveIteration(0);
        const removedItemObj = DramaItem.createRemovedItemFigureObjAtPlayer(removeItem1);
        yield DramaItem.sleepAfterRemoveIteration(1);
        yield () => removedItemObj.destroyed;
    }

    const freeLoadoutIndex = Rpg.inventory.equipment.loadout.items.findIndex(item => item === null);

    const itemFigureObj = DramaItem.createReceivedItemFigureObjAtSpeaker(equipmentToUpgrade.resultingEquipment);

    const obtainedEquipment = Rpg.inventory.equipment.receive(
        equipmentToUpgrade.resultingEquipment.id,
        equipmentToUpgrade.resultingEquipment.level,
    );

    if (equipmentToUpgrade.areEitherEquipped) {
        Rpg.inventory.equipment.equip(obtainedEquipment.id, freeLoadoutIndex);
    }

    yield () => itemFigureObj.destroyed;
}

interface UpgradeableEquipment {
    obtainedEquipments: [RpgCharacterEquipment.ObtainedEquipment, RpgCharacterEquipment.ObtainedEquipment];
    resultingEquipment: RpgInventory.Item.Equipment;
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
        obtainedEquipments: [equipment0, equipment1],
        areEitherEquipped: equipment0.loadoutIndex !== null
            || equipment1.loadoutIndex !== null,
        resultingEquipment: {
            kind: "equipment",
            id: equipmentId,
            level: equipment0.level + equipment1.level,
        },
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
