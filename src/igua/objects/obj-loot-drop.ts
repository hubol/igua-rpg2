import { sleep } from "../../lib/game-engine/routines/sleep";
import { Rng } from "../../lib/math/rng";
import { RpgLoot } from "../rpg/rpg-loot";
import { objFlop } from "./obj-flop";
import { objPocketableItem } from "./obj-pocketable-item";
import { objValuableTrove } from "./obj-valuable-trove";

const flopHorizontalSpeeds = [
    0,
    1,
    -1,
];

export function objLootDrop(drop: RpgLoot.Drop) {
    return objValuableTrove(drop.valuables)
        .coro(function* (self) {
            for (const pocketItem of drop.pocketItems) {
                // TODO probably can't just have them landing on each other
                objPocketableItem.parachuting(pocketItem).at(self).show(self.parent);
                yield sleep(250);
            }

            let speedIndex = Rng.int(flopHorizontalSpeeds.length);

            for (let i = 0; i < drop.flops.length; i++) {
                const hspeed = flopHorizontalSpeeds[(speedIndex + i) % flopHorizontalSpeeds.length];
                objFlop(drop.flops[i]).at(self).show(self.parent).speed.x = hspeed;
                yield sleep(250);
            }
        });
}
