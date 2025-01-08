import { VectorSimple } from "../../lib/math/vector-type";
import { container } from "../../lib/pixi/container";
import { RpgPocket } from "../rpg/rpg-pocket";
import { objPocketableItem } from "./obj-pocketable-item";

export function objPocketableItemSpawner(position: VectorSimple, item = RpgPocket.Item.BallFruitTypeA) {
    return container(objPocketableItem(item).at(position));
}
