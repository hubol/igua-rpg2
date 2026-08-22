import { Sfx } from "../../assets/sounds";
import { sleep, sleepf } from "../../lib/game-engine/routines/sleep";
import { Rng } from "../../lib/math/rng";
import { container } from "../../lib/pixi/container";
import { Empty } from "../../lib/types/empty";
import { DramaInventory } from "../drama/drama-inventory";
import { ask, show } from "../drama/show";
import { Cutscene } from "../globals";
import { GenerativeMusicUtils } from "../lib/generative-music-utils";
import { mxnCutscene } from "../mixins/mxn-cutscene";
import { RpgLoot } from "../rpg/rpg-loot";
import { objCharacterForestSpirit } from "./characters/obj-character-forest-spirit";
import { objCollectibleEquipment } from "./collectibles/obj-collectible-equipment";
import { objCollectibleFlop } from "./collectibles/obj-collectible-flop";
import { objCollectibleKeyItem } from "./collectibles/obj-collectible-key-item";
import { objCollectiblePocketItem } from "./collectibles/obj-collectible-pocket-item";
import { objCollectiblePotion } from "./collectibles/obj-collectible-potion";
import { objFxBurstDusty } from "./effects/obj-fx-burst-dusty";
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

            if (drop.specialEvent === "forest_spirit") {
                const forestSpiritObj = objLootForestSpirit()
                    .at(self)
                    .show();

                yield () => forestSpiritObj.destroyed;
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

function objLootForestSpirit() {
    const explanation0 = Rng.choose(
        "I got mixed up in a salad...",
        "I was mistaken for garnish...",
    );

    const explanation1 = Rng.choose(
        "... Then I got eaten.",
        "... Then I got MUNCHED on!",
    );

    let isDying = false;

    // TODO voice SFX
    return objCharacterForestSpirit()
        .mixin(mxnCutscene, function* () {
            if (isDying) {
                return;
            }
            yield* show("Thanks for rescuing me!", explanation0, explanation1);

            for (let i = 0; i < 2; i++) {
                const result = yield* ask(
                    i === 0
                        ? "In my travels, I've found some Essence. Would you like some?"
                        : "So, where do you want it?",
                    i === 0 ? "6 in pocket" : "Yes, 6 in pocket",
                    i === 0 ? "3 on keyring" : "Yes, 3 on keyring",
                    i === 0 ? "What is essence?" : null,
                );

                if (result === 0) {
                    yield* DramaInventory.receiveCount({ kind: "pocket_item", id: "EssenceForest" }, 6);
                }
                else if (result === 1) {
                    yield* DramaInventory.receiveCount({ kind: "key_item", id: "EssenceForest" }, 3);
                }
                else if (result === 2) {
                    yield* show(
                        "The council's forest division sends us around to find Essence.",
                        "The council is always looking to the past.",
                        "So, I think the Essence is a trace of the Wizard of Forest who left this world so long ago.",
                        "But its nature has never been explained to us. Always keeping secrets, of course.",
                        "It's impossible to believe that the council has a clue what they are doing.",
                        "So to give it to you is, without a doubt, an act that leaves it in more capable hands.",
                    );
                }
            }

            yield* show(
                "I'll get going now.",
                "Thanks again.",
            );

            isDying = true;
        })
        .coro(function* (self) {
            yield () => !Cutscene.isPlaying && isDying;
            // TODO SFX
            objFxBurstDusty()
                .at(self.getWorldCenter())
                .show();
            self.destroy();
        });
}
