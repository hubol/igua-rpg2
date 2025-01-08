import { VectorSimple } from "../../lib/math/vector-type";
import { container } from "../../lib/pixi/container";
import { RpgPocket } from "../rpg/rpg-pocket";
import { objPocketableItem } from "./obj-pocketable-item";

export function objPocketableItemSpawner(position: VectorSimple, defaultItem: RpgPocket.Item) {
    const obj = container()
        .track(objPocketableItemSpawner);

    function spawn(item = defaultItem) {
        // TODO types
        // @ts-expect-error
        if (obj.children[0]?.freed === false) {
            return null;
        }
        return objPocketableItem(item).at(position).show(obj);
    }

    spawn();

    return obj.merge({ spawn });
}
