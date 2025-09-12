import { Lvl } from "../../assets/generated/levels/generated-level-data";
import { CtxPocketItems } from "../objects/collectibles/obj-collectible-pocket-item-spawner";

export function scnObstacleCourse() {
    CtxPocketItems.value.variant = "objFloating";
    CtxPocketItems.value.behavior = "respawn";
    Lvl.ObstacleCourse();
}
