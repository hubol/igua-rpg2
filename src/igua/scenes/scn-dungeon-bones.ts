import { Sprite } from "pixi.js";
import { Lvl, LvlType } from "../../assets/generated/levels/generated-level-data";
import { Mzk } from "../../assets/music";
import { Sfx } from "../../assets/sounds";
import { sleep } from "../../lib/game-engine/routines/sleep";
import { RgbInt } from "../../lib/math/number-alias-types";
import { Rng } from "../../lib/math/rng";
import { range } from "../../lib/range";
import { Jukebox } from "../core/igua-audio";
import { DramaGifts } from "../drama/drama-gifts";
import { DramaInventory } from "../drama/drama-inventory";
import { DramaPlayerAttributes } from "../drama/drama-player-attributes";
import { DramaQuests } from "../drama/drama-quests";
import { ask, show } from "../drama/show";
import { mxnCutscene } from "../mixins/mxn-cutscene";
import { mxnDoorPoisonous } from "../mixins/mxn-door-poisonous";
import { mxnRpgKill } from "../mixins/mxn-rpg-kill";
import { mxnSinePivot } from "../mixins/mxn-sine-pivot";
import { mxnSparkling } from "../mixins/mxn-sparkling";
import { mxnSpeaker } from "../mixins/mxn-speaker";
import { mxnWeightedPedestalMask } from "../mixins/mxn-weighted-pedestal-mask";
import { playerObj } from "../objects/obj-player";
import { Rpg } from "../rpg/rpg";
import { RpgInventory } from "../rpg/rpg-inventory";

export function scnDungeonBones() {
    Jukebox.play(Mzk.UndergroundRucksack);
    const lvl = Lvl.DungeonBones();
    lvl.Skeleton0.mixin(mxnDungeonSkeleton, "Skeleton of Saint (Red)");
    lvl.Skeleton1.mixin(mxnDungeonSkeleton, "Skeleton of Saint (Yellow)");
    lvl.Skeleton2.mixin(mxnDungeonSkeleton, "Skeleton of Saint (Blue)");

    lvl.MidbossBlock
        .coro(function* (self) {
            yield () => lvl.MidbossSkeliguana.destroyed && !playerObj.collides(lvl.MidbossUnsafeRegion);
            self.play(Sfx.Cutscene.MysteriousDisappearance.rate(0.95, 1.05));
            self.destroy();
        });

    lvl.DeeperDoor.mixin(mxnDoorPoisonous);

    lvl.WaterGroup
        .children
        .forEach(obj => obj.mixin(mxnSinePivot));

    lvl.PlayerKillRegion.mixin(mxnRpgKill);

    lvl.SimplePedestal0
        .mixin(mxnWeightedPedestalMask, {
            terrainObjs: [lvl.PedestalWallBlock0],
            maskWhenWeighted: false,
        })
        .mixin(mxnWeightedPedestalMask, {
            terrainObjs: [lvl.PedestalWallBlock1],
        });

    enrichNoviceNpc(lvl);
    enrichResearcherNpc(lvl);
}

function enrichResearcherNpc(lvl: LvlType.DungeonBones) {
    const quest = Rpg.quest("DungeonBones.Researcher");

    lvl.ResearcherNpc
        .mixin(mxnCutscene, function* () {
            if (quest.everCompleted) {
                yield* show(
                    "I hope you enjoy the shoes I made.",
                    "I will continue my research here.",
                );
                return;
            }

            if (quest.flags.toldPlayer) {
                if (yield* ask("Oh, do you have the 20 ectoplasm I need to create a light-emitting shoe?")) {
                    const items: RpgInventory.Item[] = [
                        {
                            kind: "pocket_item",
                            id: "EctoplasmTypeA",
                        },
                        {
                            kind: "pocket_item",
                            id: "EctoplasmTypeB",
                        },
                    ];
                    if (yield* DramaInventory.tryRemoveCount(items, 20)) {
                        yield* show(
                            "Yes! Yes! Perfect!",
                            "One moment...!",
                        );
                        yield sleep(1000);
                        yield* show(
                            "My creation!!!!",
                            "Fierce! Mama!!! The boots!!!!",
                        );
                        yield* DramaQuests.complete("DungeonBones.Researcher");
                    }
                    else {
                        yield* show("Okay, little girl, you don't have enough plasm for me...");
                        yield* DramaPlayerAttributes.callName("Little girl");
                    }
                }

                return;
            }

            yield* show(
                "I'm a researcher.",
                "I'm trying to get my master's degree in Dungeons.",
                "For my thesis project, I am creating a shoe that emits light.",
                "But I need 20 ectoplasm...",
            );

            quest.flags.toldPlayer = true;
        });
}

function enrichNoviceNpc(lvl: LvlType.DungeonBones) {
    const gift = Rpg.gift("DungeonBones.ExplorerNovice");

    lvl.ExplorerNpc
        .mixin(mxnCutscene, function* () {
            yield* show(
                "I'm exploring this Dungeon as a student.",
                "My professor went waaaay ahead of me.",
            );

            const result = yield* ask(
                "Can I help you somehow?",
                "Advice",
                "No thanks",
            );

            if (result === 0) {
                yield* show(
                    "Hmm... advice...",
                    "My mentor said that you should bring Flops into the Dungeon.",
                    "You can use them on pedestals to interesting effect.",
                );

                if (gift.isGiveable()) {
                    yield* show("Here, I have an extra one that you can take.");
                    yield* DramaGifts.give(gift);
                }

                yield* show(
                    "I should say, my professor took a lot more than 1 Flop.",
                    "If you intend to go below Layer 2, you should bring at least 14 Flops.",
                );
            }
            else {
                yield* show("Great manners!");
            }
        });
}

function mxnDungeonSkeleton(obj: Sprite, name: string) {
    let isCollected = false;

    return obj
        .mixin(mxnSpeaker, { name, tintPrimary: obj.tint as RgbInt, tintSecondary: 0x000000 })
        .mixin(mxnSparkling)
        .mixin(mxnCutscene, function* () {
            if (isCollected) {
                yield* show("Already desecrated.");
                return;
            }
            if (yield* ask("Search the skeleton for goods? You will become hated.")) {
                playerObj.isBeingPiloted = true;
                playerObj.isDucking = true;
                yield sleep(1000);
                playerObj.isDucking = false;
                playerObj.isBeingPiloted = false;

                const count = Rng.int(6);

                if (count === 0) {
                    yield* show("Found nothing.");
                }
                else {
                    yield* show("Found something.");
                    yield* DramaInventory.receiveItems(
                        range(count).map(() => ({ kind: "pocket_item", id: "BoneTypeA" })),
                    );
                }
                isCollected = true;
            }
        })
        .step(self => self.sparklesPerFrame = isCollected ? 0 : 0.1);
}
