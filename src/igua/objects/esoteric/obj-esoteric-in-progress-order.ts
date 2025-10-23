import { Graphics, Sprite } from "pixi.js";
import { objText } from "../../../assets/fonts";
import { Tx } from "../../../assets/textures";
import { onPrimitiveMutate } from "../../../lib/game-engine/routines/on-primitive-mutate";
import { sleep, sleepf } from "../../../lib/game-engine/routines/sleep";
import { approachLinear } from "../../../lib/math/number";
import { Integer } from "../../../lib/math/number-alias-types";
import { container } from "../../../lib/pixi/container";
import { Null } from "../../../lib/types/null";
import { RpgFoodOrder } from "../../rpg/rpg-food-order";

export function objEsotericInProgressOrder() {
    const controls = {
        inProgressOrder: Null<RpgFoodOrder.InProgress>(),
    };

    const maskObj = new Graphics().beginFill(0xffffff).drawRect(0, 0, 85, 130);
    const itemsObj = container()
        .step(self => {
            const maxHeight = maskObj.height - 2;
            const targetY = itemsObj.height > maxHeight ? itemsObj.height - maxHeight : 0;
            self.pivot.y = approachLinear(self.pivot.y, targetY, 2);
        });

    const totalObj = container(
        new Graphics()
            .beginFill(0xffffff).drawRect(0, 0, 85, 17)
            .lineStyle(1, 0x000000).moveTo(0, 0).lineTo(85, 0),
        Sprite.from(Tx.Ui.Total).at(3, 4),
    )
        .coro(function* (self) {
            const targetObj = container().at(3, 5).show(self);
            while (true) {
                yield onPrimitiveMutate(() => controls.inProgressOrder?.list?.length ?? 0);
                targetObj.removeAllChildren();
                const price = RpgFoodOrder.getPrice(controls.inProgressOrder?.list ?? []);
                objPrice(price).show(targetObj);
            }
        });

    return container(
        new Graphics().beginFill(0xffffff).drawRect(0, 0, 85, 130),
        maskObj,
        itemsObj.masked(maskObj),
        totalObj.at(0, maskObj.height),
    )
        .merge({ objEsotericInProgressOrder: { controls } })
        .coro(function* () {
            while (true) {
                yield onPrimitiveMutate(() => controls.inProgressOrder?.list?.length ?? 0);
                const groupedItems = RpgFoodOrder.getGroupedItems(controls.inProgressOrder?.list ?? []);

                if (groupedItems.length === 0) {
                    while (itemsObj.children.length) {
                        itemsObj.children.last.destroy();
                        yield sleep(90);
                    }

                    continue;
                }

                itemsObj.removeAllChildren();
                itemsObj.pivot.y = 0;
                for (const groupedItem of groupedItems) {
                    objGroupedItem(groupedItem.item, groupedItem.count)
                        .at(3, 3 + itemsObj.height)
                        .show(itemsObj);

                    yield sleepf(2);
                }
            }
        });
}

function objGroupedItem(item: RpgFoodOrder.Item, count: Integer) {
    const nameObj = objText.MediumBold(item.name, { tint: 0x000000 });

    const obj = container(
        nameObj,
        objPrice(RpgFoodOrder.getPrice(item) * count),
    );

    if (count > 1) {
        objText.Medium("x" + count, { tint: 0x000000 }).at(nameObj.width + 2, 0).show(obj);
    }

    if (item.option !== null) {
        objText.XSmall(item.option, { tint: 0x000000 }).at(0, obj.height + 1).show(obj);
    }

    new Graphics().beginFill(0xffffff).drawRect(0, 0, 32, 4).at(0, obj.height).show(obj).alpha = 0;

    return obj;
}

function objPrice(price: Integer) {
    return container(
        Sprite.from(Tx.Collectibles.ValuableGreen).at(72, 1),
        objText.Medium(String(price), { tint: 0x000000 })
            .anchored(1, 0)
            .at(71, 0),
    );
}
