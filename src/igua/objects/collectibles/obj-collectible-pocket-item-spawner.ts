import { VectorSimple } from "../../../lib/math/vector-type";
import { container } from "../../../lib/pixi/container";
import { RpgPocket } from "../../rpg/rpg-pocket";
import { ObjCollectiblePocketItem, objCollectiblePocketItem } from "./obj-collectible-pocket-item";

export function objCollectiblePocketItemSpawner(position: VectorSimple, defaultItem: RpgPocket.Item) {
    const obj = container()
        .track(objCollectiblePocketItemSpawner);

    let itemObj: ObjCollectiblePocketItem | null = null;

    function spawn(item = defaultItem) {
        if (itemObj && !itemObj.destroyed && !itemObj.freed) {
            return null;
        }
        return itemObj = objCollectiblePocketItem(item).at(position).show(obj);
    }

    spawn();

    return obj.merge({ spawn });
}
