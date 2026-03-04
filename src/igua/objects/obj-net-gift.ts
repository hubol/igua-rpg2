import { Graphics } from "pixi.js";
import { onMutate } from "../../lib/game-engine/routines/on-mutate";
import { Rng } from "../../lib/math/rng";
import { container } from "../../lib/pixi/container";
import { DataItem } from "../data/data-item";
import { DramaInventory } from "../drama/drama-inventory";
import { DramaItem } from "../drama/drama-item";
import { show } from "../drama/show";
import { mxnCutscene } from "../mixins/mxn-cutscene";
import { IguaClient } from "../net/igua-client";
import { Rpg } from "../rpg/rpg";
import { RpgInventory } from "../rpg/rpg-inventory";

export function objNetGift(client: IguaClient) {
    const hitboxObj = new Graphics().beginFill(0xff0000).drawRect(0, 0, 32, 32);
    return container(hitboxObj)
        .coro(function* (self) {
            const figureObj = container().show(self);

            while (true) {
                if (client.room?.giftItem) {
                    DataItem.getFigureObj(client.room?.giftItem).show(figureObj);
                }
                yield onMutate.Provider(() => client.room?.giftItem);
                figureObj.removeAllChildren();
            }
        })
        .mixin(mxnCutscene, function* () {
            if (!client.room) {
                return;
            }

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

                const transaction = client.offer(item);
                yield () =>
                    Boolean(transaction.outcome);

                const outcome = transaction.outcome!;

                yield* show(outcome.accepted ? "Success" : "Someone beat you to it.");

                if (!outcome.accepted) {
                    yield* DramaInventory.receiveItems([item]);
                }
            }
            else {
                const transaction = client.take();
                yield () => Boolean(transaction.outcome);
                if (transaction.outcome!.success) {
                    // TODO shitty
                    yield* DramaInventory.receiveItems([transaction.outcome?.item! as RpgInventory.Item]);
                }
                else {
                    yield* show("Someone beat you to it.");
                }
            }
        });
}
