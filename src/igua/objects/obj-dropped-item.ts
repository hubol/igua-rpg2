import { Sfx } from "../../assets/sounds";
import { sleep } from "../../lib/game-engine/routines/sleep";
import { Rng } from "../../lib/math/rng";
import { vnew } from "../../lib/math/vector-type";
import { DataItem } from "../data/data-item";
import { scene } from "../globals";
import { RpgInventory } from "../rpg/rpg-inventory";
import { playerObj } from "./obj-player";

export function objDroppedItem(item: RpgInventory.Item) {
    const api = {
        isDeflected: false,
        item,
    };

    const speed = vnew();

    return DataItem
        .getFigureObj(item)
        .pivotedUnit(0.5, 0.5)
        .merge({ objDroppedItem: api })
        .step(self => {
            if (!api.isDeflected && Rng.bool()) {
                self.y++;
            }

            if (playerObj.collides(self)) {
                api.isDeflected = true;
                speed.x += playerObj.speed.x || playerObj.facing;
                speed.y += Math.min(playerObj.speed.y, -1);
                speed.vlength = Math.min(8, speed.vlength);
                self.play(Sfx.Impact.ItemDeflect.rate(0.5, 2));
            }

            if (api.isDeflected) {
                speed.y += 0.3;
                self.add(speed);
            }

            if (self.y >= scene.level.height + 32) {
                self.destroy();
            }
        })
        .track(objDroppedItem)
        .coro(function* (self) {
            yield () => api.isDeflected;
            self.play(Sfx.Impact.ItemDeflectInitial.rate(0.95, 1.15));
            while (true) {
                self.angle += 90 * Math.sign(speed.x || Rng.intp());
                yield sleep(200);
            }
        });
}
