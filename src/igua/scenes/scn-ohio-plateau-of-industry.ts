import { Lvl, LvlType } from "../../assets/generated/levels/generated-level-data";
import { Coro } from "../../lib/game-engine/routines/coro";
import { sleep } from "../../lib/game-engine/routines/sleep";
import { DramaInventory } from "../drama/drama-inventory";
import { DramaPotions } from "../drama/drama-potions";
import { DramaQuests } from "../drama/drama-quests";
import { ask, show } from "../drama/show";
import { mxnCutscene } from "../mixins/mxn-cutscene";
import { playerObj } from "../objects/obj-player";
import { Rpg } from "../rpg/rpg";
import { RpgInventory } from "../rpg/rpg-inventory";

export function scnOhioPlateauOfIndustry() {
    const lvl = Lvl.OhioPlateauOfIndustry();
    enrichSoupMakerNpc(lvl);
}

function enrichSoupMakerNpc(lvl: LvlType.OhioPlateauOfIndustry) {
    const items = {
        soupBowlBroken: { kind: "key_item", id: "SoupBowlBroken" },
        soupBowl: { kind: "key_item", id: "SoupBowl" },
        intelligenceUp: { kind: "potion", id: "AttributeIntelligenceUp" },
    } satisfies Record<string, RpgInventory.Item>;

    const quest = Rpg.quest("PlateauIndustry.SoupMaker.AteSoup");

    lvl.OutOfOrderSign
        .step(self => self.objEsotericOutOfOrderSign.isActive = !quest.flags.removedOutOfOrderSign);

    lvl.SoupMakerNpc
        .mixin(mxnCutscene, function* () {
            const result = yield* ask(
                "Hello. I am a normal guy making soup behind the casino. What can I do for you?",
                "About groundsoup",
                "About sign",
                "Nothing",
            );

            if (result === 0) {
                if (quest.everCompleted) {
                    yield* show(
                        "Yep, that's my soup on the ground.",
                        "It didn't taste very good.",
                        "I'll have to adjust the recipe.",
                    );
                    return;
                }

                const brokenCount = Rpg.inventory.count(items.soupBowlBroken);
                const fixedCount = Rpg.inventory.count(items.soupBowl);
                const soupBowlsCount = brokenCount + fixedCount;

                yield* show(
                    "Indeed, that is my soup on the ground.",
                    "When I combined and heated my ingredients, I forgot to bring a bowl.",
                );

                const result = yield* ask(
                    "If you bring me two soup bowls, we can share a meal together.",
                    soupBowlsCount < 1 ? "OK" : null,
                    soupBowlsCount === 1 ? "I have a bowl!" : null,
                    soupBowlsCount >= 2 ? "I have bowls!" : null,
                );

                if (result === 1) {
                    yield* show("OK. Please try harder. We need two bowls to share a meal.");
                    if (fixedCount === 0) {
                        yield* show("Also that bowl is broken. It won't work.");
                    }
                }
                else if (result === 2) {
                    yield* show("Yay!!!!");
                    if (fixedCount < 2) {
                        yield sleep(500);
                        yield* show(
                            fixedCount === 0
                                ? "Wait, these bowls are broken. This won't do."
                                : "Wait, one bowl is broken. This won't do.",
                            "Isn't there someone who could make improvements with glue?",
                        );
                    }
                    else {
                        yield* DramaInventory.removeCount(items.soupBowl, 2);
                        yield* playerObj.walkTo(lvl.PlayerEatMarker.x);
                        playerObj.auto.facing = -1;
                        yield* show("Cheers!");
                        yield* Coro.all([
                            DramaPotions.useOnTarget(items.intelligenceUp.id, lvl.SoupMakerNpc),
                            DramaPotions.useOnPlayer(items.intelligenceUp.id),
                        ]);
                        yield* show(
                            "That was putrid.",
                            "But I feel smarter now.",
                        );
                        yield* DramaQuests.complete(quest);
                    }
                }
            }
            else if (result === 1) {
                if (!quest.everCompleted) {
                    yield* show(
                        "Sorry, my sign is out of order right now.",
                        "I'm really concerned about my soup.",
                        "Once that's taken care of, I think I can fix my sign.",
                    );
                }
                else if (quest.flags.removedOutOfOrderSign) {
                    yield* show("Yep, that's my sign.");
                }
                else if (!quest.flags.removedOutOfOrderSign) {
                    yield* show(
                        "Oh, right!",
                        "I can remove the out of order sign now.",
                    );

                    lvl.SoupMakerNpc.auto.facing = -1;
                    yield sleep(500);
                    quest.flags.removedOutOfOrderSign = true;
                    yield sleep(500);

                    lvl.SoupMakerNpc.auto.facing = 1;

                    yield* show(
                        "OK it's done.",
                        "Isn't that cool?",
                    );
                }
            }
            else if (result === 2) {
                yield* show("OK. Great. Awesome.");
            }
        });
}
