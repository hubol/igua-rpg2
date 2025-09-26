import { Sfx } from "../../assets/sounds";
import { sleep, sleepf } from "../../lib/game-engine/routines/sleep";
import { Rng } from "../../lib/math/rng";
import { container } from "../../lib/pixi/container";
import { Empty } from "../../lib/types/empty";
import { GenerativeMusicUtils } from "../lib/generative-music-utils";
import { RpgLoot } from "../rpg/rpg-loot";
import { objCollectibleEquipment } from "./collectibles/obj-collectible-equipment";
import { objCollectibleFlop } from "./collectibles/obj-collectible-flop";
import { objCollectibleKeyItem } from "./collectibles/obj-collectible-key-item";
import { objCollectiblePocketItem } from "./collectibles/obj-collectible-pocket-item";
import { objCollectiblePotion } from "./collectibles/obj-collectible-potion";
import { ObjFxRerollNotification, objFxRerollNotification } from "./effects/obj-fx-reroll-notification";
import { objValuableTrove } from "./obj-valuable-trove";

const dropSpeedH = [
    0,
    1,
    -1,
];

export function objLootDrop(drop: RpgLoot.Drop) {
    return container()
        .coro(function* (self) {
            const notificationObjs = Empty<ObjFxRerollNotification>();

            for (let i = 0; i < drop.rerolledTimes; i++) {
                const scaleIndex = GenerativeMusicUtils.scales.major[i];
                const rate = scaleIndex === undefined ? 2 : GenerativeMusicUtils.cScaleRates[scaleIndex];
                const notificationObj = objFxRerollNotification().show(self);
                notificationObjs.push(notificationObj);
                notificationObj.play(Sfx.Effect.RerollNotification.rate(rate + Rng.float(-0.01, 0.01)));
                yield sleepf(40);
            }

            for (const notificationObj of notificationObjs) {
                notificationObj.controls.die = true;
                yield sleepf(20);
            }

            objValuableTrove(drop.valuables).at(self).show(self.parent);

            for (let i = 0; i < drop.pocketItems.length; i++) {
                const hspeed = dropSpeedH[i % dropSpeedH.length];
                objCollectiblePocketItem.objParachuting(drop.pocketItems[i])
                    .at(self)
                    .show(self.parent)
                    .speed.x = hspeed;
                yield sleep(250);
            }

            for (let i = 0; i < drop.keyItems.length; i++) {
                const keyItemId = drop.keyItems[i];
                objCollectibleKeyItem(keyItemId).at(self).add(10 * Math.cos(i * 1.4), -60 + 10 * Math.sin(i)).show(
                    self.parent,
                );
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

            self.destroy();
        });
}
