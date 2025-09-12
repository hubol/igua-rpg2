import { SceneLocal } from "../../../lib/game-engine/scene-local";
import { VectorSimple } from "../../../lib/math/vector-type";
import { container } from "../../../lib/pixi/container";
import { RpgPocket } from "../../rpg/rpg-pocket";
import { ObjCollectiblePocketItem, objCollectiblePocketItem } from "./obj-collectible-pocket-item";

interface CtxPocketItemsValue {
    variant: "objBouncing" | "objFloating";
}

export const CtxPocketItems = new SceneLocal<CtxPocketItemsValue>(() => ({ variant: "objBouncing" }), "CtxPocketItems");

export function objCollectiblePocketItemSpawner(
    position: VectorSimple,
    defaultItem: RpgPocket.Item,
    variant: CtxPocketItemsValue["variant"],
) {
    const obj = container()
        .track(objCollectiblePocketItemSpawner);

    let itemObj: ObjCollectiblePocketItem | null = null;

    function spawn(item = defaultItem) {
        if (itemObj && !itemObj.destroyed && !itemObj.isCollectible) {
            return null;
        }
        return itemObj = objCollectiblePocketItem[variant](item).at(position).show(obj);
    }

    spawn();

    return obj.merge({ spawn });
}
