import { Lvl, LvlType } from "../../assets/generated/levels/generated-level-data";
import { Mzk } from "../../assets/music";
import { sleep } from "../../lib/game-engine/routines/sleep";
import { Jukebox } from "../core/igua-audio";
import { DramaCobbler } from "../drama/drama-cobbler";
import { DramaGifts } from "../drama/drama-gifts";
import { DramaInventory } from "../drama/drama-inventory";
import { DramaQuests } from "../drama/drama-quests";
import { ask, show } from "../drama/show";
import { Cutscene } from "../globals";
import { mxnCharacterCricket } from "../mixins/mxn-character-cricket";
import { mxnCutscene } from "../mixins/mxn-cutscene";
import { mxnIguanaShopkeeper } from "../mixins/mxn-iguana-shopkeeper";
import { mxnSpeaker } from "../mixins/mxn-speaker";
import { objFxHeart } from "../objects/effects/obj-fx-heart";
import { playerObj } from "../objects/obj-player";
import { Rpg } from "../rpg/rpg";

export function scnOpenMarket() {
    Jukebox.play(Mzk.PreciousInstructions);
    const lvl = Lvl.OpenMarket();

    lvl.FoodNpc
        .mixin(mxnIguanaShopkeeper, {
            messages: [
                "Food! Get your food here!",
                "Nutritious food!",
                "Selling foods!",
                "Delicious berries!",
            ],
            shopId: "OpenFood",
        });

    lvl.JumpNpc
        .mixin(mxnIguanaShopkeeper, {
            messages: [
                "Jump differently with my products!",
                "Love jumping? My wares are for you!",
            ],
            shopId: "OpenJump",
        });

    lvl.CombatNpc
        .mixin(mxnIguanaShopkeeper, {
            messages: [
                "Are angels beating your ass? Talk with me!",
                "Need to be tougher? I have some stuff for you!",
            ],
            shopId: "OpenCombat",
        });

    lvl.GluemakerNpc
        .mixin(mxnIguanaShopkeeper, {
            messages: [
                "Selling glue for combining shoes!",
                "I've got loads of glue! Useful for improving shoes!",
            ],
            shopId: "GluemakerOhio",
        });

    lvl.CobblerNpc
        .mixin(mxnCutscene, function* () {
            yield* DramaCobbler.upgradeOrFix();
        });

    enrichFlipNpc(lvl);
    enrichOlgaNpc(lvl);
    enrichCricket(lvl);
}

function enrichCricket(lvl: LvlType.OpenMarket) {
    const quest = Rpg.quest("Ohio.CricketFamily");

    lvl.Cricket
        .mixin(mxnCharacterCricket)
        .mixin(mxnCutscene, function* () {
            if (quest.everCompleted) {
                yield* show(
                    "It's nice to know that my son is happy.",
                );
                return;
            }

            if (quest.flags.deliveredLetter) {
                yield* show("Did you deliver the letter to my son?");
                Cutscene.setCurrentSpeaker(playerObj);
                yield* show(
                    "Yes! He appreciated the letter.",
                    "He is just relaxing by the sea with his boyfriend.",
                    "He wanted me to tell you that he is happy.",
                );
                // TODO sfx
                objFxHeart.objBurst(10, 10)
                    .at(lvl.Cricket)
                    .show();

                yield sleep(2000);
                Cutscene.setCurrentSpeaker(lvl.Cricket);
                yield* show(
                    "Oh wow... that makes me... really happy...",
                    "Thank you for doing this.",
                );
                yield* DramaQuests.complete("Ohio.CricketFamily");
                return;
            }

            if (Rpg.inventory.has(quest.data.items.motherLetterKeyItem)) {
                yield* show(
                    "Have you delivered the letter to my son yet?",
                    "Remember, he should be camping up north by the sea.",
                );
                return;
            }

            yield* show(
                "Oh! Oh! Oh!",
                "My son is camping up north to look at the sea!!!",
                "Oh! Oh! Oh!",
                "I'm so worried about him!",
                "You can't just do things like look at the sea all the time!!!",
                "You need to do other things, like get a well-paying job!",
                "I haven't heard from him in a while, and I need to stay here in case there are any good deals.",
            );

            if (yield* ask("Can you deliver this letter for me?")) {
                yield* show("Much appreciated!");
                yield* DramaInventory.receiveCount(quest.data.items.motherLetterKeyItem, 1);
                yield* show("Again, he told me he would be up north to look at the sea.");
            }
            else {
                yield* show("Got it! I will just be here worrying in the meantime.");
            }
        });
}

function enrichOlgaNpc(lvl: LvlType.OpenMarket) {
    const quest = Rpg.quest("MishaHouse.Birthday");
    if (quest.flags.celebrated && quest.isCompletable) {
        lvl.OlgaNpc
            .mixin(mxnCutscene, function* () {
                yield* show(
                    "Thanks for your help with Misha's birthday.",
                    "It means a lot.",
                );

                if (quest.peekCompletionReward()) {
                    yield* show("Please take this.");
                    yield* DramaQuests.complete(quest);
                }
            });
    }
    else {
        lvl.OlgaNpc.destroy();
    }
}

function enrichFlipNpc(lvl: LvlType.OpenMarket) {
    const gift = Rpg.gift("Ohio.Market.Flip");
    let forceLeft = false;

    lvl.FlipNpc
        .step(self => {
            self.auto.facing = (lvl.FlipDial.objEsotericDial.remainingTicksUnit > 0 || forceLeft) ? -1 : 1;
        })
        .mixin(mxnCutscene, function* () {
            if (lvl.FlipNpc.facing < 0) {
                forceLeft = true;
                yield* show(
                    "Thanks for making me face to the left.",
                    "It's my favorite direction to face.",
                );
                if (gift.isGiveable()) {
                    yield* DramaGifts.give(gift);
                    yield* show("I hope you enjoy that. It's a rarity in this land.");
                }
                forceLeft = false;
                return;
            }
            yield* show(
                "I'm in love with facing to the left.",
                "Please help me face to the left using the dial.",
            );
        });
}
