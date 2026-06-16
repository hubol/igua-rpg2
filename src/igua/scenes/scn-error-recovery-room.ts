import { Lvl } from "../../assets/generated/levels/generated-level-data";
import { Mzk } from "../../assets/music";
import { Tx } from "../../assets/textures";
import { Jukebox } from "../core/igua-audio";
import { DramaQuests } from "../drama/drama-quests";
import { show } from "../drama/show";
import { mxnFxNoise } from "../mixins/effects/mxn-fx-noise";
import { mxnCutscene } from "../mixins/mxn-cutscene";
import { mxnSinePivot } from "../mixins/mxn-sine-pivot";
import { objFxHeart } from "../objects/effects/obj-fx-heart";
import { Rpg } from "../rpg/rpg";
import { Search } from "../utils/search";

export function scnErrorRecoveryRoom() {
    Jukebox.play(Mzk.BestSeller);
    const lvl = Lvl.ErrorRecoveryRoom();

    Rpg.character.position.sceneName = scnErrorRecoveryRoom.name;

    Search.findDecals(Tx.Town.Signage.Warning)
        .forEach(x => x.mixin(mxnSinePivot));

    let rewarded = false;

    lvl.HubolNpc
        .mixin(mxnCutscene, function* () {
            if (!rewarded) {
                yield* show("Sorry about the mess...");
                yield* DramaQuests.complete("ErrorRecoveryRoom.Hubol");
                rewarded = true;
            }

            yield* show("Hopefully it helps.");

            if (!lvl.HubolNpc.is(mxnFxNoise)) {
                objFxHeart.objBurst(20, 8).at(lvl.HubolNpc).add(0, -20).show();
                // @ts-expect-error `is` return type is shit :-(
                lvl.HubolNpc.mixin(mxnFxNoise);
            }
        });
}
