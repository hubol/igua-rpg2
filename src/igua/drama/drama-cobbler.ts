import { DisplayObject } from "pixi.js";
import { Logger } from "../../lib/game-engine/logger";
import { sleep } from "../../lib/game-engine/routines/sleep";
import { Check } from "../../lib/types/check";
import { isNotNullish } from "../../lib/types/guards/is-not-nullish";
import { Null } from "../../lib/types/null";
import { DataEquipment } from "../data/data-equipment";
import { DataItem } from "../data/data-item";
import { Rpg } from "../rpg/rpg";
import { RpgCharacterEquipment } from "../rpg/rpg-character-equipment";
import { RpgInventory } from "../rpg/rpg-inventory";
import { DramaInventory } from "./drama-inventory";
import { DramaItem } from "./drama-item";
import { ask, show } from "./show";

const consts = {
    glueItem: Check<RpgInventory.Item>({ kind: "key_item", id: "EquipmentGlue" }),
    superGlueItem: Check<RpgInventory.Item>({ kind: "key_item", id: "SuperEquipmentGlue" }),
    soupBowlBrokenItem: Check<RpgInventory.Item>({ kind: "key_item", id: "SoupBowlBroken" }),
    soupBowlItem: Check<RpgInventory.Item>({ kind: "key_item", id: "SoupBowl" }),
};

function* upgradeOrFix() {
    const fixWhat = yield* ask(
        "I'm a cobbler. Can I help you?",
        "Upgrade shoes",
        Rpg.inventory.count(consts.soupBowlBrokenItem) >= 1 ? "Fix my bowl?" : null,
    );

    if (fixWhat === 1) {
        yield* show("Yes, I can fix your bowl. I just need some standard Shoe Glue.");
        if (!Rpg.inventory.has(consts.glueItem)) {
            yield sleep(500);
            yield* show("It looks like you don't have any Shoe Glue.");
        }
        else {
            if (yield* ask("Want me to repair your Broken Soup Bowl with Shoe Glue?")) {
                yield* show("OK! Let's do this!");
                yield* DramaInventory.removeCount(consts.soupBowlBrokenItem, 1);
                yield* DramaInventory.removeCount(consts.glueItem, 1);
                yield* DramaInventory.receiveItems([consts.soupBowlItem]);
            }
            else {
                yield* show("OK! Let me know if you change your mind.");
            }
        }
        return;
    }

    let glueItem = consts.glueItem;
    let upgradeRecipes = findCombinationUpgradeEquipmentRecipes(Rpg.inventory.equipment);

    if (
        Rpg.inventory.has(consts.superGlueItem)
        && Rpg.inventory.equipment.list.length > 0
        && (yield* ask("It looks like you have some Perfected Shoe Glue. Do you want to use it?"))
    ) {
        glueItem = consts.superGlueItem;
        upgradeRecipes = findSingleUpgradeEquipmentRecipes(Rpg.inventory.equipment);
    }

    const hasGlue = Rpg.inventory.has(glueItem);
    const hasUpgradeableEquipments = upgradeRecipes.length > 0;

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

    const options = upgradeRecipes.map(
        ({ outputEquipment, inputEquipments }) => {
            const message = `I'll make a ${DataItem.getName(outputEquipment)}\nby combining your ${
                inputEquipments.map(equipment => `Lvl. ${equipment.level}`).join(" and ")
            } with ${DataItem.getName(glueItem)}`;
            return ({
                item: outputEquipment,
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

    if (DataEquipment.getById(chosenEquipment.id).flags.has("is_statically_enchanted")) {
        yield* show("Sorry, those shoes are statically enchanted and cannot be upgraded.");
        return;
    }

    const upgradeRecipe = upgradeRecipes.find(upgradeable => upgradeable.outputEquipment === chosenEquipment);

    if (!upgradeRecipe) {
        Logger.logAssertError(
            "DramaEquipment.upgrade",
            new Error("Failed to find chosenEquipment in upgradeRecipes"),
            { upgradeRecipes, chosenEquipment },
        );

        return;
    }

    yield* DramaInventory.removeCount(glueItem, 1);

    for (const obtainedEquipment of upgradeRecipe.inputEquipments) {
        Rpg.inventory.equipment.remove(obtainedEquipment.id);
    }

    {
        const removeItems: RpgInventory.Item.Equipment[] = upgradeRecipe.inputEquipments.map((
            { equipmentId, level },
        ) => ({ kind: "equipment", id: equipmentId, level }));
        let fxObj = Null<DisplayObject>();
        for (let i = 0; i < removeItems.length; i++) {
            fxObj = DramaItem.createRemovedItemFigureObjAtPlayer(removeItems[i]);
            yield DramaItem.sleepAfterRemoveIteration(i);
        }
        yield () => fxObj?.destroyed ?? true;
    }

    const freeLoadoutIndex = Rpg.inventory.equipment.loadout.items.findIndex(item => item === null);

    const itemFigureObj = DramaItem.createReceivedItemFigureObjAtSpeaker(upgradeRecipe.outputEquipment);

    const obtainedEquipment = Rpg.inventory.equipment.receive(
        upgradeRecipe.outputEquipment.id,
        upgradeRecipe.outputEquipment.level,
    );

    if (upgradeRecipe.areAnyInputsEquipped) {
        Rpg.inventory.equipment.equip(obtainedEquipment.id, freeLoadoutIndex);
    }

    yield () => itemFigureObj.destroyed;
}

interface UpgradeEquipmentRecipe {
    inputEquipments: Array<RpgCharacterEquipment.ObtainedEquipment>;
    outputEquipment: RpgInventory.Item.Equipment;
    areAnyInputsEquipped: boolean;
}

function toUpgradeEquipmentRecipe(
    equipmentId: DataEquipment.Id,
    obtainedEquipments: Array<RpgCharacterEquipment.ObtainedEquipment>,
): UpgradeEquipmentRecipe | null {
    if (obtainedEquipments.length < 2) {
        return null;
    }

    const [equipment0, equipment1] = [...obtainedEquipments].sort((a, b) => b.level - a.level);

    return {
        inputEquipments: [equipment0, equipment1],
        areAnyInputsEquipped: equipment0.loadoutIndex !== null
            || equipment1.loadoutIndex !== null,
        outputEquipment: {
            kind: "equipment",
            id: equipmentId,
            level: equipment0.level + equipment1.level,
        },
    };
}

function findCombinationUpgradeEquipmentRecipes(
    characterEquipment: RpgCharacterEquipment,
): Array<UpgradeEquipmentRecipe> {
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
            toUpgradeEquipmentRecipe(equipmentId as DataEquipment.Id, obtainedEquipments)
        )
        .filter(isNotNullish);
}

function findSingleUpgradeEquipmentRecipes(
    characterEquipment: RpgCharacterEquipment,
): Array<UpgradeEquipmentRecipe> {
    const maximumObtainedEquipments: Partial<Record<DataEquipment.Id, RpgCharacterEquipment.ObtainedEquipment>> = {};

    for (const obtainedEquipment of characterEquipment.list) {
        const maxEquipment = maximumObtainedEquipments[obtainedEquipment.equipmentId];
        if (
            !maxEquipment
            || obtainedEquipment.level > maxEquipment.level
            || obtainedEquipment.loadoutIndex !== null
        ) {
            maximumObtainedEquipments[obtainedEquipment.equipmentId] = obtainedEquipment;
        }
    }

    return Object.values(maximumObtainedEquipments)
        .map(obtainedEquipment => ({
            areAnyInputsEquipped: obtainedEquipment.loadoutIndex !== null,
            inputEquipments: [obtainedEquipment],
            outputEquipment: {
                id: obtainedEquipment.equipmentId,
                kind: "equipment",
                level: obtainedEquipment.level + 1,
            },
        }));
}

export const DramaCobbler = {
    upgradeOrFix,
};
