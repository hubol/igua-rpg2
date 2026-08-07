import { Lvl, LvlType } from "../../assets/generated/levels/generated-level-data";
import { Mzk } from "../../assets/music";
import { factor, interpvr } from "../../lib/game-engine/routines/interp";
import { Jukebox } from "../core/igua-audio";
import { ask, show } from "../drama/show";
import { scene } from "../globals";
import { mxnCutscene } from "../mixins/mxn-cutscene";
import { Rpg } from "../rpg/rpg";

export function scnMountFlop() {
    Jukebox.play(Mzk.EditableMoog);
    const lvl = Lvl.MountFlop();
    enrichBestFriendHaverNpc(lvl);
}

function enrichBestFriendHaverNpc(lvl: LvlType.MountFlop) {
    const gift = Rpg.gift("MountFlop.Flower");

    lvl.BestFriendHaverNpc
        .mixin(mxnCutscene, function* () {
            if (!gift.isGiveable()) {
                yield* show("That foolish wizard...");
                return;
            }

            yield* ask("That foolish wizard...", "What's wrong?");
            yield* show(
                "Oh nothing...",
                "It's just that my friend is in trouble because of all of the sprites on Mount Flop.",
            );

            scene.camera.mode = "controlled";
            yield interpvr(scene.camera).factor(factor.sine).to(lvl.PanToHouseRegion).over(1000);

            yield* ask("Think you can help him?", "I will try!");
            yield* show("Thank you. He is known to have really cool items. Maybe he'll give you something nice.");
        });
}
