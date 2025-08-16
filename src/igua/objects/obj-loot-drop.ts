import { sleep } from "../../lib/game-engine/routines/sleep";
import { Rng } from "../../lib/math/rng";
import { RpgLoot } from "../rpg/rpg-loot";
import { objCollectibleEquipment } from "./collectibles/obj-collectible-equipment";
import { objCollectiblePotion } from "./collectibles/obj-collectible-potion";
import { objFlop } from "./obj-flop";
import { objPocketableItem } from "./obj-pocketable-item";
import { objValuableTrove } from "./obj-valuable-trove";

const dropSpeedH = [
    0,
    1,
    -1,
];

export function objLootDrop(drop: RpgLoot.Drop) {
    return objValuableTrove(drop.valuables)
        .coro(function* (self) {
            for (let i = 0; i < drop.pocketItems.length; i++) {
                const hspeed = dropSpeedH[i % dropSpeedH.length];
                objPocketableItem.parachuting(drop.pocketItems[i]).at(self).show(self.parent).speed.x = hspeed;
                yield sleep(250);
            }

            let speedIndex = Rng.int(dropSpeedH.length);

            for (let i = 0; i < drop.flops.length; i++) {
                const hspeed = dropSpeedH[(speedIndex + i) % dropSpeedH.length];
                objFlop(drop.flops[i]).at(self).show(self.parent).speed.x = hspeed;
                yield sleep(250);
            }

            let xSign = Rng.intp();
            for (let i = 0; i < drop.equipments.length; i++) {
                const equipmentObj = objCollectibleEquipment(drop.equipments[i]).at(self).show(self.parent);
                equipmentObj.speed.y = Rng.float(-1, -3);
                equipmentObj.speed.x = Rng.float(1, 2) * xSign;
                yield sleep(333);
                xSign *= -1;
            }

            const xOffsets = [0, -48, 48];
            for (let i = 0; i < drop.potions.length; i++) {
                objCollectiblePotion(drop.potions[i])
                    .at(self)
                    .add(xOffsets[i % xOffsets.length], -32)
                    .show(self.parent);

                yield sleep(333);
            }
        });
}
