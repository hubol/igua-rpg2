import { Lvl, LvlType } from "../../assets/generated/levels/generated-level-data";
import { Mzk } from "../../assets/music";
import { sleep } from "../../lib/game-engine/routines/sleep";
import { Jukebox } from "../core/igua-audio";
import { ask, show } from "../cutscene/show";
import { NpcPersonas } from "../data/data-npc-personas";
import { mxnBoilPivot } from "../mixins/mxn-boil-pivot";
import { mxnCutscene } from "../mixins/mxn-cutscene";
import { objFxBurst32 } from "../objects/effects/obj-fx-burst-32";
import { objFish } from "../objects/obj-fish";
import { RpgProgress } from "../rpg/rpg-progress";

export function scnNewBalltownFishmonger() {
    Jukebox.play(Mzk.BreadCrumbPool);
    const lvl = Lvl.NewBalltownFishmonger();
    enrichFishmonger(lvl);
}

function enrichAquarium(lvl: LvlType.NewBalltownFishmonger) {
    const fishObjs = [lvl.Fish0, lvl.Fish1, lvl.Fish2].map(markerObj =>
        objFish(markerObj.x * 9999 + markerObj.y * 8888 + 800_903).at(markerObj).show()
    );

    lvl.WaterLineTop.mixin(mxnBoilPivot);
    return {
        fishObjs,
    };
}

function enrichFishmonger(lvl: LvlType.NewBalltownFishmonger) {
    const { fishObjs } = enrichAquarium(lvl);

    if (RpgProgress.flags.newBalltown.fishmonger.isReadyToDeliverToArmorer) {
        fishObjs[0].destroy();
        lvl.Fishmonger.destroy();
        return;
    }

    lvl.Fishmonger.mixin(mxnCutscene, function* () {
        yield* show("Hello! I deal in fish.");
        const result = yield* ask("Can I help you somehow?", "Favorite fish aspect", "Fish delivery", "No");
        if (result === 0) {
            yield* show(
                "Fish are very entertaining to watch.",
                "I feel bad that I have trapped them in a jail cell. But boy are they cute!",
                "I want to share my fish with the world!",
            );
        }
        else if (result === 1) {
            const fishRecipient = yield* ask(
                "You want a fish delivered? That's great! Who wants a fish?",
                RpgProgress.flags.newBalltown.armorer.toldPlayerAboutDesireForFish
                    ? NpcPersonas.NewBalltownArmorer.name
                    : null,
                "I don't know",
            );

            if (fishRecipient === 1) {
                yield* show("Oh, okay. Let me know if you find an interested party!");
                return;
            }

            if (fishRecipient === 0) {
                yield* show(`${NpcPersonas.NewBalltownArmorer.name}...? Oh yeah, he had a fishtank!`);
                if (yield* ask("Ready to make the delivery with me?")) {
                    yield* show("Great!");
                    yield sleep(500);
                    objFxBurst32().at(fishObjs[0]).show();
                    fishObjs[0].destroy();
                    // TODO sfx
                    yield sleep(500);
                    yield* show("See you outside!");
                    yield* lvl.Fishmonger.walkTo(lvl.Door.x + 30);
                    lvl.Fishmonger.destroy();
                    RpgProgress.flags.newBalltown.fishmonger.isReadyToDeliverToArmorer = true;
                }
                else {
                    yield* show("Okay, let me know when you are ready!");
                }
            }
        }
        else if (result === 2) {
            yield* show("Okay! See you around!");
        }
    });
}
