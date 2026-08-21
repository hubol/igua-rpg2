import { Lvl, LvlType } from "../../assets/generated/levels/generated-level-data";
import { ask, show } from "../drama/show";
import { mxnCutscene } from "../mixins/mxn-cutscene";

export function scnOhioPlateauOfIndustry() {
    const lvl = Lvl.OhioPlateauOfIndustry();
    enrichSoupMakerNpc(lvl);
}

function enrichSoupMakerNpc(lvl: LvlType.OhioPlateauOfIndustry) {
    lvl.SoupMakerNpc
        .mixin(mxnCutscene, function* () {
            const result = yield* ask(
                "Hello. I am a normal guy making soup behind the casino. What can I do for you?",
                "About groundsoup",
                "About sign",
                "Nothing",
            );

            if (result === 0) {
                yield* show(
                    "Indeed, that is my soup on the ground.",
                    "When I combined and heated my ingredients, I forgot to bring a bowl.",
                    "If you bring me two soup bowls, we can share a meal together.",
                );
            }
            else if (result === 1) {
                yield* show(
                    "Sorry, my sign is out of order right now.",
                    "I'm really concerned about my soup.",
                    "Once that's taken care of, I think I can fix my sign.",
                );
            }
            else if (result === 2) {
                yield* show("OK. Great. Awesome.");
            }
        });
}
