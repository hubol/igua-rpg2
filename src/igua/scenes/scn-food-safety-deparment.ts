import { Lvl } from "../../assets/generated/levels/generated-level-data";
import { sleep } from "../../lib/game-engine/routines/sleep";
import { DramaFacts } from "../drama/drama-facts";
import { DramaInventory } from "../drama/drama-inventory";
import { DramaQuests } from "../drama/drama-quests";
import { ask, show } from "../drama/show";
import { mxnCutscene } from "../mixins/mxn-cutscene";
import { Rpg } from "../rpg/rpg";
import { RpgInventory } from "../rpg/rpg-inventory";

export function scnFoodSafetyDepartment() {
    const lvl = Lvl.FoodSafetyDepartment();
    const quest = Rpg.quest("FoodSafetyDeparment.MetalDiscovered");

    lvl.FoodCheckerNpc
        .mixin(mxnCutscene, function* () {
            const result = yield* ask(
                "Hey there. I work with food safety. Need something?",
                "Check my food!",
                "What is the point of this?",
                "Why is it dark in here?",
                "Don't need nothin'",
            );

            if (result === 0) {
                yield* show("You need your food checked? Alright! Let's take a look.");

                const potions = yield* DramaInventory.potions.removeAll();

                if (potions.length === 0) {
                    yield* show("You don't have any food.", "Come back when you do!");
                    return;
                }

                yield* show("Let's see here...");
                yield sleep(1000);

                // TODO x ray effects
                const potionsWithMetal = potions.filter(potion => potion.state.containsMetal);

                for (let i = 0; i < potionsWithMetal.length; i++) {
                    yield* show(
                        "Whoa! Whoa! Whoa!",
                        i === 0 ? "Found some metal!!!" : "Found some more metal!!!",
                    );

                    yield* show(`DAYUM! It's ${DramaQuests.peekCompletionRewardName(quest)}!`);
                    yield* DramaQuests.complete(quest);
                }

                yield* show(potionsWithMetal.length === 0 ? "Nope, no metal." : "That's all the metal for now!");
                yield* show("Here's your food back!");

                const items = potions.map((potion): RpgInventory.ReceivableItem => ({
                    kind: "potion",
                    id: potion.id,
                    state: { ...potion.state, containsMetal: false },
                }));
                yield* DramaInventory.receiveItems(items);
            }
            else if (result === 1) {
                // TODO could be cool if food from different regions was more likely to contain metal
                const messages = [
                    "Sometimes food is created in low-quality environments.",
                    "This can sometimes result in the food containing metal.",
                    "This is generally harmless.",
                    "Really, it's actually exciting when it contains metal.",
                    "Could it be something useful??? Helpful??? Pink??? Purple???",
                    "If you let me check your food, we can find out TOGETHER!",
                ];

                yield* DramaFacts.memorize("FoodMetal", ...messages);
            }
            else if (result === 2) {
                yield* show("Don't want to talk about this.");
            }
            else {
                yield* show("Understood.");
            }
        });
}
