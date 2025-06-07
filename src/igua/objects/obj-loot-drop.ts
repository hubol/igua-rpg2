import { sleep } from "../../lib/game-engine/routines/sleep";
import { Rng } from "../../lib/math/rng";
import { RpgLoot } from "../rpg/rpg-loot";
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
        });
}
