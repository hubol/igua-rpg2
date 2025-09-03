import { sleep } from "../../lib/game-engine/routines/sleep";
import { Rng } from "../../lib/math/rng";
import { RpgLoot } from "../rpg/rpg-loot";
import { objCollectibleEquipment } from "./collectibles/obj-collectible-equipment";
import { objCollectibleFlop } from "./collectibles/obj-collectible-flop";
import { objCollectibleKeyItem } from "./collectibles/obj-collectible-key-item";
import { objCollectiblePotion } from "./collectibles/obj-collectible-potion";
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

            for (const keyItemId of drop.keyItems) {
                objCollectibleKeyItem(keyItemId).at(self).add(0, -60).show(self.parent);
                yield sleep(500);
            }

            let speedIndex = Rng.int(dropSpeedH.length);

            for (let i = 0; i < drop.flops.length; i++) {
                const hspeed = dropSpeedH[(speedIndex + i) % dropSpeedH.length];
                objCollectibleFlop(drop.flops[i]).at(self).show(self.parent).speed.x = hspeed;
                yield sleep(250);
            }

            let xSign = Rng.intp();
            for (let i = 0; i < drop.equipments.length; i++) {
                objCollectibleEquipment(drop.equipments[i]).at(self).add(0, -50).show(self.parent);
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
