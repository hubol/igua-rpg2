import { Lvl, LvlType } from "../../assets/generated/levels/generated-level-data";
import { Mzk } from "../../assets/music";
import { Jukebox } from "../core/igua-audio";
import { DramaCobbler } from "../drama/drama-cobbler";
import { DramaGifts } from "../drama/drama-gifts";
import { DramaQuests } from "../drama/drama-quests";
import { show } from "../drama/show";
import { mxnCutscene } from "../mixins/mxn-cutscene";
import { mxnIguanaShopkeeper } from "../mixins/mxn-iguana-shopkeeper";
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
