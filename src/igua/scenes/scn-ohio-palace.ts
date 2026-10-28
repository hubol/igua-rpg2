import { Lvl } from "../../assets/generated/levels/generated-level-data";
import { Mzk } from "../../assets/music";
import { factor, interpvr } from "../../lib/game-engine/routines/interp";
import { vnew } from "../../lib/math/vector-type";
import { Jukebox } from "../core/igua-audio";
import { ZIndex } from "../core/scene/z-index";
import { DramaInventory } from "../drama/drama-inventory";
import { DramaQuests } from "../drama/drama-quests";
import { show } from "../drama/show";
import { mxnEsotericPalaceHomunculus } from "../mixins/esoteric/mxn-esoteric-palace-homunculus";
import { mxnCutscene } from "../mixins/mxn-cutscene";
import { mxnSinePivot } from "../mixins/mxn-sine-pivot";
import { objFxLight } from "../objects/effects/obj-fx-light";
import { objFish } from "../objects/obj-fish";
import { playerObj } from "../objects/obj-player";
import { Rpg } from "../rpg/rpg";
import { TerrainAttributes } from "../systems/terrain-attributes";

export function scnOhioPalace() {
    const waterFishQuest = Rpg.quest("FishDelivery.HomunculusWater");

    Jukebox.play(Mzk.SodaMachine);
    const lvl = Lvl.OhioPalace();

    [lvl.FishBlock, lvl.FishBlock_1, lvl.FishBlock_2, lvl.FishBlock_3]
        .forEach(obj => obj.attributes = TerrainAttributes.Decorative);

    lvl.WaterGroup
        .children
        .forEach(obj => obj.mixin(mxnSinePivot));

    lvl.WaterGroup
        .coro(function* (self) {
            if (!waterFishQuest.everCompleted) {
                self.pivot.y = 128;
                yield () => waterFishQuest.everCompleted;
                yield interpvr(self.pivot).factor(factor.sine).to(0, 0).over(1000);
            }

            objFish.forHomunculusWater()
                .at(lvl.FishMarker)
                .zIndexed(ZIndex.TerrainDecals)
                .show();
        });

    lvl.WaterNpc
        .mixin(mxnEsotericPalaceHomunculus, {
            progressKey: "ohio",
            kind: "key_locations",
            hintIds: ["Ohio.MagicKey0", "Ohio.MagicKey1", "Ohio.MagicKey2"],
        })
        .coro(function* (self) {
            self.mixin(mxnCutscene, function* () {
                const doesPlayerHaveFish = Rpg.inventory.has(waterFishQuest.data.items.fishKeyItem);
                const result = yield* self.mxnEsotericPalaceHomunculus.greet(
                    "Glub! Hello. Is there anything I can help with?",
                    !doesPlayerHaveFish && !waterFishQuest.everCompleted ? "Any errands?" : null,
                    doesPlayerHaveFish ? "Your fish has arrived!" : null,
                    "Nothing",
                );

                if (result === 0) {
                    yield* show(
                        "Oh, an errand...",
                        "Yes, I would like a watery familiar...",
                        "Perhaps a fish?",
                        "I believe there is a fishmonger in Indiana.",
                    );

                    waterFishQuest.flags.toldPlayerAboutDesire = true;
                }
                else if (result === 1) {
                    yield* show("?!?! A fishy-fishy friend for me?!");
                    yield* DramaInventory.removeAll(waterFishQuest.data.items.fishKeyItem);
                    yield* DramaQuests.complete(waterFishQuest);
                    yield* show(
                        "!!! Wow!!! Thank you so much!!!",
                        "Happiness is real!!!",
                    );
                }
            });
        });

    lvl.ForestNpc
        .mixin(mxnEsotericPalaceHomunculus, {
            progressKey: "ohio",
            kind: "hall_location",
            messages: ["The crystal hall is located in the skies above Mount Flop."],
        })
        .coro(function* (self) {
            self.mixin(mxnCutscene, function* () {
                yield* self.mxnEsotericPalaceHomunculus.greet("Bark! Hello. What do you want?", "Nothing");
            });
        });

    lvl.LightGroup
        .masked(objFxLight({ direction: vnew(0, 1), shadowCasterObjs: [playerObj, lvl.WaterNpc, lvl.ForestNpc] }))
        .alpha = 0.5;
}
