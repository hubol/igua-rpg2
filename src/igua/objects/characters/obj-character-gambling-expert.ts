import { Rng } from "../../../lib/math/rng";
import { DramaFacts } from "../../drama/drama-facts";
import { DramaInventory } from "../../drama/drama-inventory";
import { dramaShop } from "../../drama/drama-shop";
import { ask, show } from "../../drama/show";
import { scene } from "../../globals";
import { mxnCutscene } from "../../mixins/mxn-cutscene";
import { mxnSparkling } from "../../mixins/mxn-sparkling";
import { Rpg } from "../../rpg/rpg";
import { scnCasino } from "../../scenes/scn-casino";
import { scnEfficientHome } from "../../scenes/scn-efficient-home";
import { scnGrottoIndianaShop } from "../../scenes/scn-grotto-indiana-shop";
import { scnNewBalltownOutskirtsSecretShop } from "../../scenes/scn-new-balltown-outskirts-secret-shop";
import { scnWorldMap } from "../../scenes/scn-world-map";
import { objIguanaNpc } from "../obj-iguana-npc";

const sceneNames = [
    scnCasino,
    scnNewBalltownOutskirtsSecretShop,
    scnWorldMap,
    scnEfficientHome,
    scnGrottoIndianaShop,
]
    .map(fn => fn.name);

function* dramaShowFavoritePlaces() {
    yield* show(
        "MY TOP TEN FAVORITE PLACES TO HANG OUT",
        "#1 Swamp Casino\nFor obvious reasons",
        "#2 New Balltown Secret Shop\nGreat items!",
        "#3 Field\nLove that fresh air",
        "#4 My Apartment\nThere's no place like home",
        "#5 Blue Merchant Grotto\nBeing underground is cool",
        "The remaining 5 positions are left blank",
    );
}

const isGamblingExpertInCurrentScene = (function () {
    function check() {
        const targetSceneName = sceneNames[Rpg.flags.gamblingExpert.locationSeed % sceneNames.length];
        return scene.source.name === targetSceneName;
    }

    return function () {
        if (!check()) {
            return false;
        }

        while (check()) {
            Rpg.flags.gamblingExpert.locationSeed = Rng.int(99999999);
        }

        return true;
    };
})();

export function objCharacterGamblingExpert() {
    const npcObj = objIguanaNpc("GamblingTeacher").mixin(mxnSparkling);
    npcObj.head.mouth.isSmoking = true;
    npcObj.sparklesPerFrame = 0.1;
    npcObj.sparklesTint = 0xf0f000;

    let gaveTaxiWhistle = false;

    return npcObj
        .coro(function* (self) {
            if (!isGamblingExpertInCurrentScene()) {
                self.destroy();
            }
        })
        .mixin(mxnCutscene, function* () {
            yield* show("I am a proud expert of gambling.");
            const result = yield* ask(
                "What do you want?",
                "Gambling tip",
                "Trade",
                gaveTaxiWhistle ? null : "Taxi?",
                "Nothin'",
            );
            if (result === 0) {
                yield* DramaFacts.memorize("GamblingTip");
            }
            else if (result === 1) {
                yield* dramaShop("GamblingTeacher", {
                    tintPrimary: npcObj.speaker.tintSecondary,
                    tintSecondary: npcObj.speaker.tintPrimary,
                });
                yield* show(
                    "I won't stick around here, so you might want to buy stuff now.",
                    "Just sayin', sucka!",
                );
            }
            else if (result === 2) {
                yield* show(
                    "Yeah, there's a taxi to the Swamp Casino.",
                    "Use this to summon it.",
                );

                yield* DramaInventory.receiveItems([{ kind: "potion", id: "TaxiWhistleCasino" }]);
                gaveTaxiWhistle = true;
            }
            else if (result === 3) {
                yield* show("K bye");
            }
        });
}

objCharacterGamblingExpert.dramaShowFavoritePlaces = dramaShowFavoritePlaces;
