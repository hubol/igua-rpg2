import { Lvl, LvlType } from "../../assets/generated/levels/generated-level-data";
import { Mzk } from "../../assets/music";
import { Logger } from "../../lib/game-engine/logger";
import { sleep } from "../../lib/game-engine/routines/sleep";
import { Rng } from "../../lib/math/rng";
import { Jukebox } from "../core/igua-audio";
import { DataPocketItem } from "../data/data-pocket-item";
import { DataSongTitle } from "../data/data-song-title";
import { DramaInventory } from "../drama/drama-inventory";
import { DramaQuests } from "../drama/drama-quests";
import { dramaShop } from "../drama/drama-shop";
import { ask, show } from "../drama/show";
import { mxnCutscene } from "../mixins/mxn-cutscene";
import { Rpg } from "../rpg/rpg";

export function scnGrottoIndianaShop() {
    Jukebox.play(Mzk.IronSkittle);
    const lvl = Lvl.GrottoIndianaShop();
    enrichShopkeeper(lvl);
    enrichCombatTeacher(lvl);
    enrichPocketTeacher(lvl);
    enrichQuestTeacher(lvl);
}

function enrichShopkeeper(lvl: LvlType.GrottoIndianaShop) {
    lvl.ShopkeeperNpc
        .mixin(mxnCutscene, function* () {
            const result = yield* ask("Welcome to the hole. What can I help you with?", "Wares", "The area");
            if (result === 0) {
                if (Rpg.character.buffs.approval.indianaMerchants <= 0) {
                    yield* show(
                        "... Hm...",
                        "Sorry, I don't think I can trust you yet...",
                        "I hail from a tribe of merchants.",
                        "We have long relished the bittered beets found in the strange market.",
                        "Produce the symbol of our god and you may take a look at my wares.",
                    );
                }
                else {
                    yield* dramaShop("GrottoIndiana", lvl.ShopkeeperNpc.speaker);
                }
            }
            else {
                yield* show(
                    "This is Indiana.",
                    "Currently, you are in my trade grotto.",
                    "There are many iguanas in New Balltown, south of here.",
                    "You'll need a way to climb up there, though...",
                    "Another place with a lot of iguanas is the strange market to the southwest.",
                    "To the southeast is the university.",
                    "To the north is the great tower.",
                    "There is an apartment complex there.",
                );
            }
        });
}

function enrichCombatTeacher(lvl: LvlType.GrottoIndianaShop) {
    lvl.CombatShopNpc
        .coro(function* (self) {
            yield () => lvl.EnemyBrick.destroyed;
            self.mixin(mxnCutscene, function* () {
                yield* dramaShop("CombatTeacher", {
                    tintPrimary: self.speaker.tintSecondary,
                    tintSecondary: self.speaker.tintPrimary,
                });
            });
        });
}

function enrichPocketTeacher(lvl: LvlType.GrottoIndianaShop) {
    const flagReceivedPocketItemIds = Rpg.flags.grotto.pocketTeacher.receivedPocketItemIds;
    const minPocketItemIdsCount = 8;

    lvl.PocketShopNpc
        .mixin(mxnCutscene, function* () {
            if (Rpg.quest("Grotto.PocketTeacher.ReceivedManyPocketItems").everCompleted) {
                yield* dramaShop("PocketTeacher", lvl.PocketShopNpc.speaker);
                return;
            }

            yield* show("Pockets! Pockets!");

            if (flagReceivedPocketItemIds.size === 0) {
                if (!(yield* ask("Are you any good with Pocket?"))) {
                    yield* show("Oh...");
                    return;
                }

                yield* show(
                    "Oh yeah?! Maybe you should prove it then.",
                    `If you bring me ${minPocketItemIdsCount} different kinds of pocket items, I'll show you my special wares!`,
                );
            }
            else {
                const itemNames = [...flagReceivedPocketItemIds]
                    .map(id => DataPocketItem.getById(id).name);

                yield* show("So far, you've given me...");

                while (itemNames.length) {
                    yield* show(
                        itemNames
                            .splice(0, 3)
                            .map(name => `- ${name}`)
                            .join("\n"),
                    );
                }
                yield* show("So, I need " + (minPocketItemIdsCount - flagReceivedPocketItemIds.size) + " more.");
            }

            if (!(yield* ask("Do you have a pocket item for me?"))) {
                yield* show("Ah, let me know if you do!");
                return;
            }

            yield* show("Great, I'll take one then!");

            if (Rpg.inventory.pocket.countTotal() === 0) {
                yield sleep(1000);
                yield* show("...Wait, you don't have any.");
                return;
            }

            const heldPocketItemIds = Rpg.inventory.pocket.uniqueItems;
            let receivedAtLeastOne = false;

            for (const id of heldPocketItemIds) {
                if (flagReceivedPocketItemIds.has(id)) {
                    yield sleep(1000);
                    yield* show("Hmm... but you've already given me " + DataPocketItem.getById(id).name);
                    continue;
                }
                receivedAtLeastOne = true;
                yield* DramaInventory.removeCount({ kind: "pocket_item", id }, 1);
                flagReceivedPocketItemIds.add(id);

                if (flagReceivedPocketItemIds.size >= minPocketItemIdsCount) {
                    yield* show("Good job!");
                    yield* DramaQuests.complete("Grotto.PocketTeacher.ReceivedManyPocketItems");
                    yield* show("Talk with me again if you want to buy stuff!!!");
                    return;
                }
            }

            if (receivedAtLeastOne) {
                yield* show(
                    "Cool. I still wanna see " + (minPocketItemIdsCount - flagReceivedPocketItemIds.size) + " more!",
                );
            }
        });
}

function enrichQuestTeacher(lvl: LvlType.GrottoIndianaShop) {
    const flagQuestTeacher = Rpg.flags.grotto.questTeacher;

    const musicLocationHints = {
        "ArticulateReunion": "At the race track",
        "ProfitMotive": "Naturally, 777 means that you win here",
        "OpenWound": "Secret shopper alert!",
        "GolfResort": "Mud on the floor",
        "FatFire": "\"Is someone going to help him get out of that vase?!\"",
        "SoldierBoyDemo": "\"Did you get tickets for the Famous Tour?\"",
        "WondrousAmerica": "\"Welcome back to my channel! Today we're going to be unboxing...\"",
        "UnforgivableToner": "How do so many apartments fit in such a tiny space?",
    } satisfies Partial<Record<Mzk.Id, string>>;

    type HintableMzkId = keyof typeof musicLocationHints;

    function getHint(id: Mzk.Id) {
        if (!(id in musicLocationHints)) {
            Logger.logContractViolationError("enrichQuestTeacher.getHint", new Error("music id is not hintable"), {
                id,
            });
            return "??? This is a bug ???";
        }

        return musicLocationHints[id as HintableMzkId];
    }

    lvl.QuestShopNpc
        .mixin(mxnCutscene, function* () {
            if (Rpg.quest("Grotto.QuestTeacher.GuessedSongsCorrectly").everCompleted) {
                yield* dramaShop("QuestTeacher", lvl.QuestShopNpc.speaker);
                return;
            }

            if (flagQuestTeacher.expectedMzkId) {
                yield* show("Your location hint was:\n" + getHint(flagQuestTeacher.expectedMzkId));
                if (!(yield* ask("Did you figure out what song plays there?"))) {
                    yield* show("When you do, let me know!");
                    return;
                }

                const expected = DataSongTitle.getByMusicTrack(Mzk[flagQuestTeacher.expectedMzkId]);

                let title = "";

                const firstWordOptions = getSongTitleQuizOptions("firstWord", expected);
                const firstWordIndex = yield* ask("What is the first word in the song title?", ...firstWordOptions);
                title += firstWordOptions[firstWordIndex];

                const remainingWordsOptions = getSongTitleQuizOptions("remainingWords", expected);
                const remainingWordsIndex = yield* ask(
                    `"${title}"\nWhat is the rest of the song title?`,
                    ...remainingWordsOptions,
                );
                title += " " + remainingWordsOptions[remainingWordsIndex];

                yield* show(`"${title}"...`);

                if (title === expected.title) {
                    yield* show("That's right!");
                    flagQuestTeacher.correctMzkIds.add(flagQuestTeacher.expectedMzkId);
                }
                else {
                    yield* show("Sorry that's wrong! You'll have to restart.");
                    flagQuestTeacher.correctMzkIds.clear();
                }

                flagQuestTeacher.expectedMzkId = null;
                yield sleep(1000);
            }
            else {
                yield* show("You look like you need a quest!");
            }

            if (flagQuestTeacher.correctMzkIds.size >= 3) {
                yield* show("You did it!!! I'm so proud of you!!!");
                yield* DramaQuests.complete("Grotto.QuestTeacher.GuessedSongsCorrectly");
                yield* show("Talk to me again for a shopping experience unlike anything else!");
            }
            else {
                if (flagQuestTeacher.correctMzkIds.size === 0) {
                    yield* show(
                        "Music is everywhere!",
                        "I will give you a hint for a location.",
                        "You must go to that location and determine what song is playing there.",
                        "I'll have you do this three times.",
                    );
                }
                else if (flagQuestTeacher.correctMzkIds.size === 1) {
                    yield* show("This is your second of three challenges.");
                }
                else {
                    yield* show("This is the last challenge! Don't fuck it up!");
                }

                const mzkIdOptions = Object
                    .keys(musicLocationHints)
                    .filter(mzkId => !flagQuestTeacher.correctMzkIds.has(mzkId as any));
                const mzkId = Rng.item(mzkIdOptions) as Mzk.Id;
                flagQuestTeacher.expectedMzkId = mzkId;

                yield* show("Your location hint is:\n" + getHint(mzkId));
            }
        });
}

function getSongTitleQuizOptions(songTitleKey: "firstWord" | "remainingWords", expectedSongTitle: DataSongTitle.Model) {
    const expectedOption = expectedSongTitle[songTitleKey];
    const set = new Set(
        Object.values(DataSongTitle.Manifest).map(model => model[songTitleKey]).filter(string => string),
    );
    set.delete(expectedOption);
    return Rng.shuffle([
        ...[...set].slice(0, 5),
        expectedOption,
    ]);
}
