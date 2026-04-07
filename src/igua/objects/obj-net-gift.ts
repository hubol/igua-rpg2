import { Graphics } from "pixi.js";
import { Coro } from "../../lib/game-engine/routines/coro";
import { onMutate } from "../../lib/game-engine/routines/on-mutate";
import { sleep } from "../../lib/game-engine/routines/sleep";
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
import { RpgSaveFiles } from "../rpg/rpg-save-files";

export function objNetGift(client: IguaClient) {
    let warned = false;

    const hitboxObj = new Graphics().beginFill(0xff0000).drawRect(-16, -32, 32, 32).invisible();
    return container(hitboxObj)
        .collisionShape(CollisionShape.DisplayObjects, [hitboxObj])
        .mixin(mxnSpeaker, { name: "Shoe Altar", tintPrimary: 0xE5BB00, tintSecondary: 0xAD3600 })
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
                return;
            }

            if (!warned) {
                yield* show(
                    "Here you can offer shoes for other iguanas to take.",
                    "Be careful, as once your shoes are taken, it might not be possible to retrieve them.",
                    "Additionally, if you are ejected from the lounge, you may not be able to retrieve your shoes.",
                );
                warned = true;
            }

            yield* dramaNetGift(client);
        })
        .zIndexed(ZIndex.Entities);
}

function* dramaNetGift(client: IguaClient) {
    const giftItem = client.room.giftItem;

    if (!giftItem) {
        const options = Rpg.inventory.equipment.list
            .filter(equipment => equipment.loadoutIndex === null)
            .uniqueBy(({ equipmentId, level }) => ({ equipmentId, level }))
            .map(({ equipmentId, level }) => ({
                kind: "equipment" as const,
                id: equipmentId,
                level,
            }))
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
        RpgSaveFiles.Current.save();

        const outcome = yield* dramaTransaction(client, client.offer(item));

        if (outcome?.accepted) {
            yield* show("Success");
        }
        else {
            if (outcome?.accepted === false) {
                yield* show("Someone beat you to it.");
            }
            yield* DramaInventory.receiveItems([item]);
            RpgSaveFiles.Current.save();
        }
    }
    else {
        const outcome = yield* dramaTransaction(client, client.take());

        if (outcome?.success) {
            // TODO I think that IguaCient should not give us a transaction with an unsanitized item...
            const clientItem = IguaClient.sanitizeItem(outcome.item);
            if (clientItem) {
                yield* DramaInventory.receiveItems([clientItem]);
                RpgSaveFiles.Current.save();
            }
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
