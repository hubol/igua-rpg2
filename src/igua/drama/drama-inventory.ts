import { DisplayObject } from "pixi.js";
import { Coro } from "../../lib/game-engine/routines/coro";
import { sleep } from "../../lib/game-engine/routines/sleep";
import { Integer } from "../../lib/math/number-alias-types";
import { container } from "../../lib/pixi/container";
import { range } from "../../lib/range";
import { Null } from "../../lib/types/null";
import { DataEquipment } from "../data/data-equipment";
import { DataItem } from "../data/data-item";
import { DataPocketItem } from "../data/data-pocket-item";
import { layers } from "../globals";
import { playerObj } from "../objects/obj-player";
import { Rpg } from "../rpg/rpg";
import { RpgHotDogs } from "../rpg/rpg-hot-dogs";
import { RpgInventory } from "../rpg/rpg-inventory";
import { RpgPocket } from "../rpg/rpg-pocket";
import { DramaItem } from "./drama-item";
import { DramaLib } from "./drama-lib";
import { DramaMisc } from "./drama-misc";
import { objDramaOwnedCount } from "./objects/obj-drama-owned-count";
import { show } from "./show";

interface AskUseCountOptions {
    min?: Integer;
    max?: Integer;
    multipleOf?: Integer;
    rejectMessage?: string;
}

function* askRemoveCount(
    message: string,
    item: RpgInventory.Item,
    { min = 1, max: rawMax, multipleOf = 1, rejectMessage = "Never mind" }: AskUseCountOptions = {},
) {
    const heldCount = Rpg.inventory.count(item);
    const max = Math.min(Math.floor(heldCount / multipleOf) * multipleOf, rawMax ?? Number.MAX_SAFE_INTEGER);

    const value = yield* DramaMisc.askNullableInteger(message, {
        messageObj: DataItem.getFigureObj(item).pivotedUnit(0.5, 0.5).scaled(2, 2).at(0, -15),
        min,
        max,
        multipleOf,
        rejectMessage,
        disabledMessage: heldCount >= min ? null : `You need at least ${min}`,
    });

    const removeFiguresObj = container()
        .coro(function* (self) {
            yield* removeCountFromPlayer(item, Number(value));

            self.destroy();
        })
        .show(layers.overlay.messages);

    yield () => removeFiguresObj.destroyed;

    return value;
}

/** Before calling this function, you must assert that the player has the demanded amount */
function* removeCountFromPlayer(item: RpgInventory.Item, count: Integer) {
    if (count <= 0) {
        return;
    }

    const initialCount = Rpg.inventory.count(item);
    Rpg.inventory.remove(item, count);
    const endingCount = Rpg.inventory.count(item);

    return yield* visualizeRemoveCountFromPlayer(item, initialCount, endingCount);
}

function* visualizeRemoveCountFromPlayer(
    itemOrItems: RpgInventory.Item | RpgInventory.Item[],
    initialCount: Integer,
    endingCount: Integer,
) {
    if (initialCount === endingCount) {
        return;
    }

    const colors = DramaLib.Speaker.getColors();
    const count = initialCount - endingCount;

    const ownedObj = objDramaOwnedCount({
        bgTint: colors.primary,
        fgTint: colors.textPrimary,
        count: initialCount,
        visibleWhenZero: true,
    })
        .pivotedUnit(0.5, 0.5)
        .at(playerObj)
        .add(0, 10)
        .show();

    yield sleep(750);

    let removedFigureObj: DisplayObject | null = null;

    const items = Array.isArray(itemOrItems) ? itemOrItems : [itemOrItems];
    for (let i = 0; i < count; i++) {
        ownedObj.controls.count = initialCount - i - 1;
        const item = items[i] ?? items.last;
        removedFigureObj = DramaItem.createRemovedItemFigureObjAtPlayer(item);
        yield DramaItem.sleepAfterRemoveIteration(i);
    }

    yield () => !removedFigureObj || removedFigureObj.destroyed;
    ownedObj.destroy();
}

function* emptyPocket() {
    const result = Rpg.inventory.pocket.empty();

    for (const pocketItemId of Object.keys(result.items) as DataPocketItem.Id[]) {
        const removedCount = result.items[pocketItemId];
        yield* visualizeRemoveCountFromPlayer({ kind: "pocket_item", id: pocketItemId }, removedCount, 0);
    }

    return result;
}

interface AskWhichAndRemoveOneOptions {
    message?: string;
}

function* askWhichAndRemoveOne<TItem extends RpgInventory.Item>(
    items: TItem[],
    options: AskWhichAndRemoveOneOptions = {},
) {
    const item = yield* askWhich<TItem>(options?.message ?? "Which to offer?", items);

    if (item === null) {
        return null;
    }

    yield* removeCountFromPlayer(item, 1);

    return item;
}

function* askWhich<TItem extends RpgInventory.Item>(message: string, items: TItem[]) {
    return yield* DramaItem.choose({
        message,
        noneMessage: "Nothing, sorry",
        options: items
            .map(item => ({ item, count: Rpg.inventory.count(item) }))
            .filter(({ count }) => count >= 1)
            .map(({ item }) => ({
                item,
                message: DataItem.getName(item) + "\n" + DataItem.getDescription(item),
            })),
    });
}

function* receiveItems(items: RpgInventory.Item[]) {
    const pocketReceiveResults = new Map<RpgInventory.Item, RpgPocket.ReceiveResult>();

    const pocketItems = items.filter(item => item.kind === "pocket_item") as RpgInventory.Item.PocketItem[];
    for (const item of pocketItems) {
        pocketReceiveResults.set(item, Rpg.inventory.pocket.receive(item.id));
    }

    for (const item of items.filter(item => item.kind !== "pocket_item")) {
        Rpg.inventory.receive(item);
    }

    let lastObj = Null<DisplayObject>();

    // TODO improve FX
    for (let i = 0; i < items.length; i++) {
        const item = items[i];
        lastObj = DramaItem.createReceivedItemFigureObjAtSpeaker(item, pocketReceiveResults.get(item));
        yield DramaItem.sleepAfterRemoveIteration(i);
    }

    yield () => !lastObj || lastObj.destroyed;
}

function* receiveCount(item: RpgInventory.Item, count: Integer) {
    yield* receiveItems(range(count).map(() => item));
}

interface AskWhichAndRemoveCountOptions extends AskUseCountOptions {
    message?: string;
    countMessage?: string;
}

function* askWhichAndRemoveCount<TItem extends RpgInventory.Item>(
    items: TItem[],
    options: AskWhichAndRemoveCountOptions = {},
) {
    const item = yield* askWhich(options.message ?? "Which to offer?", items);
    if (!item) {
        return null;
    }
    const count = yield* askRemoveCount(options.countMessage ?? "How many?", item, options);
    if (!count) {
        return null;
    }

    return { item, count };
}

function* askWhichAndRemoveCountEquipment(
    id: DataEquipment.Id,
    options: AskWhichAndRemoveCountOptions = {},
) {
    const items = Rpg.inventory.equipment.getLevelCounts(id)
        .map(({ level }): RpgInventory.Item.Equipment => ({ kind: "equipment", id, level }));

    return yield* askWhichAndRemoveCount(items, options);
}

function* removeAll(item: RpgInventory.Item) {
    const count = Rpg.inventory.count(item);
    yield* removeCountFromPlayer(item, count);
    return count;
}

function* addCondimentToHotDog(condimentId: RpgHotDogs.CondimentId, applyCoro?: Coro.Type) {
    const result = RpgHotDogs.apply(Rpg.inventory.potions, condimentId);
    if (result.isSuccess) {
        yield* DramaInventory.removeCount({ kind: "potion", id: result.removePotionId }, 1);
        if (applyCoro) {
            yield* applyCoro;
        }
        yield* DramaInventory.receiveItems([{ kind: "potion", id: result.receivePotionId }]);
        return;
    }
    yield* show(
        result.haveAnyHotDogs ? "None of your hot dogs need that condiment." : "You don't have any hot dogs.",
    );
}

function* removeAllPotions() {
    const potions = Rpg.inventory.potions.removeAll();
    yield* visualizeRemoveCountFromPlayer(
        potions.map(({ id }) => ({ kind: "potion", id })),
        potions.length,
        0,
    );
    return potions;
}

export const DramaInventory = {
    askRemoveCount,
    askWhichAndRemoveOne,
    askWhichAndRemoveCount,
    equipment: {
        askWhichAndRemoveCount: askWhichAndRemoveCountEquipment,
    },
    receiveCount,
    receiveItems,
    removeCount: removeCountFromPlayer,
    removeAll,
    pocket: {
        empty: emptyPocket,
    },
    potions: {
        addCondimentToHotDog,
        removeAll: removeAllPotions,
    },
};
