import { Graphics } from "pixi.js";
import { Coro } from "../../lib/game-engine/routines/coro";
import { onMutate } from "../../lib/game-engine/routines/on-mutate";
import { sleep } from "../../lib/game-engine/routines/sleep";
import { Rng } from "../../lib/math/rng";
import { CollisionShape } from "../../lib/pixi/collision";
import { container } from "../../lib/pixi/container";
import { ZIndex } from "../core/scene/z-index";
import { DataItem } from "../data/data-item";
import { DramaInventory } from "../drama/drama-inventory";
import { DramaItem } from "../drama/drama-item";
import { show } from "../drama/show";
import { mxnCutscene } from "../mixins/mxn-cutscene";
import { mxnSpeaker } from "../mixins/mxn-speaker";
import { IguaClient } from "../net/igua-client";
import { Rpg } from "../rpg/rpg";
import { RpgInventory } from "../rpg/rpg-inventory";

export function objNetGift(client: IguaClient) {
    const hitboxObj = new Graphics().beginFill(0xff0000).drawRect(-16, -32, 32, 32).invisible();
    return container(hitboxObj)
        .collisionShape(CollisionShape.DisplayObjects, [hitboxObj])
        .mixin(mxnSpeaker, { name: "Shoe Altar", colorPrimary: 0xE5BB00, colorSecondary: 0xAD3600 })
        .coro(function* (self) {
            const figureObj = container().show(self);

            while (true) {
                if (client.room.giftItem) {
                    DataItem.getFigureObj(client.room.giftItem)
                        .pivotedUnit(0.5, 1)
                        .show(figureObj);
                }
                yield onMutate.Provider(() => client.room.giftItem);
                figureObj.removeAllChildren();
            }
        })
        .mixin(mxnCutscene, function* () {
            if (!client.isOnline) {
                yield* show("You are offline.");
                return;
            }

            yield* dramaNetGift(client);
        })
        .zIndexed(ZIndex.Entities);
}

function* dramaNetGift(client: IguaClient) {
    const giftItem = client.room.giftItem;

    if (!giftItem) {
        const options = Rng.shuffle([...Rpg.inventory.equipment.list])
            .filter(equipment => equipment.loadoutIndex === null)
            .map(({ equipmentId, level }) => ({
                kind: "equipment" as const,
                id: equipmentId,
                level,
            }))
            .slice(0, 7)
            .map((item) => ({ item, message: DataItem.getName(item) }));

        const item = yield* DramaItem.choose({
            message: "Which shoe to offer?",
            noneMessage: "None!",
            options,
        });

        if (item === null) {
            return;
        }

        // TODO shitty, should be a better API!
        const obtainedId = Rpg.inventory.equipment.list.find(equipment =>
            equipment.equipmentId === item.id && equipment.level === item.level
        )?.id ?? -1;

        Rpg.inventory.equipment.remove(obtainedId);

        const outcome = yield* dramaTransaction(client, client.offer(item));

        if (outcome?.accepted) {
            yield* show("Success");
        }
        else {
            if (outcome?.accepted === false) {
                yield* show("Someone beat you to it.");
            }
            yield* DramaInventory.receiveItems([item]);
        }
    }
    else {
        const outcome = yield* dramaTransaction(client, client.take());

        if (outcome?.success) {
            // TODO shitty
            yield* DramaInventory.receiveItems([outcome.item as RpgInventory.Item]);
        }
        else if (outcome?.success === false) {
            yield* show("Someone beat you to it.");
        }
    }
}

function* dramaTransaction<T>(client: IguaClient, transaction: IguaClient.Transaction<T>) {
    let wentOffline = false;
    let timedOut = false;

    yield* Coro.race([
        Coro.chain([() => !client.isOnline, () => wentOffline = true]),
        Coro.chain([sleep(2000), () => timedOut = true]),
        () => Boolean(transaction.outcome),
    ]);

    if (!wentOffline && !timedOut) {
        return transaction.outcome!;
    }

    if (wentOffline) {
        yield* show("You went offline...");
    }

    if (timedOut) {
        yield* show("Request timed out...");
    }

    return null;
}
