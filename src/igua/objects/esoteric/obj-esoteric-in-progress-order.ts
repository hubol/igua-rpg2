import { Graphics } from "pixi.js";
import { objText } from "../../../assets/fonts";
import { onPrimitiveMutate } from "../../../lib/game-engine/routines/on-primitive-mutate";
import { sleep, sleepf } from "../../../lib/game-engine/routines/sleep";
import { Integer } from "../../../lib/math/number-alias-types";
import { container } from "../../../lib/pixi/container";
import { Null } from "../../../lib/types/null";
import { RpgFoodOrder } from "../../rpg/rpg-food-order";

export function objEsotericInProgressOrder() {
    const controls = {
        inProgressOrder: Null<RpgFoodOrder.InProgress>(),
    };

    const maskObj = new Graphics().beginFill(0xffffff).drawRect(0, 0, 70, 130);
    const itemsObj = container();

    return container(
        new Graphics().beginFill(0xffffff).drawRect(0, 0, 70, 130),
        maskObj,
        itemsObj,
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
                for (const groupedItem of groupedItems) {
                    objGroupedItem(groupedItem.item, groupedItem.count)
                        .at(3, itemsObj.height)
                        .show(itemsObj);
                    yield sleepf(2);
                }
            }
        })
        .masked(maskObj);
}

function objGroupedItem(item: RpgFoodOrder.Item, count: Integer) {
    const nameObj = objText.MediumBold(item.name, { tint: 0x000000 });

    const obj = container(nameObj);

    if (count > 1) {
        objText.Medium("x" + count, { tint: 0x000000 }).at(nameObj.width + 8, 0).show(obj);
    }

    if (item.option !== null) {
        objText.XSmall(item.option, { tint: 0x000000 }).at(0, obj.height + 1).show(obj);
    }

    return obj;
}
