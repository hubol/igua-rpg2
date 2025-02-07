import { Lvl, LvlType } from "../../assets/generated/levels/generated-level-data";
import { Mzk } from "../../assets/music";
import { Jukebox } from "../core/igua-audio";
import { ask, show } from "../cutscene/show";
import { NpcPersonas } from "../data/data-npc-personas";
import { mxnBoilPivot } from "../mixins/mxn-boil-pivot";
import { mxnCutscene } from "../mixins/mxn-cutscene";
import { objFish } from "../objects/obj-fish";
import { RpgProgress } from "../rpg/rpg-progress";

export function scnNewBalltownFishmonger() {
    Jukebox.play(Mzk.BreadCrumbPool);
    const lvl = Lvl.NewBalltownFishmonger();
    enrichAquarium(lvl);
    enrichFishmonger(lvl);
}

function enrichAquarium(lvl: LvlType.NewBalltownFishmonger) {
    for (const fishMarker of [lvl.Fish0, lvl.Fish1, lvl.Fish2]) {
        objFish(fishMarker.x * 9999 + fishMarker.y * 8888 + 800_903).at(fishMarker).show();
    }

    lvl.WaterLineTop.mixin(mxnBoilPivot);
}

function enrichFishmonger(lvl: LvlType.NewBalltownFishmonger) {
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
                yield* ask("Ready to make the delivery?");
                // TODO start delivery sequence
            }
        }
        else if (result === 2) {
            yield* show("Okay! See you around!");
        }
    });
}
