import { sleep } from "../../../lib/game-engine/routines/sleep";
import { SceneLocal } from "../../../lib/game-engine/scene-local";
import { VectorSimple } from "../../../lib/math/vector-type";
import { container } from "../../../lib/pixi/container";
import { DataPocketItem } from "../../data/data-pocket-item";
import { ObjCollectiblePocketItem, objCollectiblePocketItem } from "./obj-collectible-pocket-item";

interface CtxPocketItemsValue {
    variant: "objBouncing" | "objFloating";
    behavior: "default" | "respawn";
    pocketItemIds: {
        typeA: DataPocketItem.Id;
        typeB: DataPocketItem.Id;
    };
}

export const CtxPocketItems = new SceneLocal<CtxPocketItemsValue>(
    () => ({
        variant: "objBouncing",
        behavior: "default",
        pocketItemIds: { typeA: "BallFruitTypeA", typeB: "BallFruitTypeB" },
    }),
    "CtxPocketItems",
);

export function objCollectiblePocketItemSpawner(
    position: VectorSimple,
    defaultItem: DataPocketItem.Id,
    variant: CtxPocketItemsValue["variant"],
    behavior: CtxPocketItemsValue["behavior"],
) {
    const obj = container()
        .track(objCollectiblePocketItemSpawner);

    let itemObj: ObjCollectiblePocketItem | null = null;

    function spawn(item = defaultItem) {
        if (itemObj && !itemObj.destroyed && (itemObj.isCollectible || variant === "objBouncing")) {
            return null;
        }
        return itemObj = objCollectiblePocketItem[variant](item).at(position).show(obj);
    }

    spawn();

    const spawnerObj = obj.merge({ spawn });

    if (behavior === "respawn") {
        spawnerObj.coro(function* () {
            while (true) {
                yield () => Boolean(itemObj?.destroyed);
                yield sleep(8_000);
                spawn();
            }
        });
    }

    return spawnerObj;
}
