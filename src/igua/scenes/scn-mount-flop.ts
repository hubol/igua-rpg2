import { Lvl, LvlType } from "../../assets/generated/levels/generated-level-data";
import { Mzk } from "../../assets/music";
import { Coro } from "../../lib/game-engine/routines/coro";
import { factor, interpvr } from "../../lib/game-engine/routines/interp";
import { Jukebox } from "../core/igua-audio";
import { ask, show } from "../drama/show";
import { scene } from "../globals";
import { mxnFxBlink } from "../mixins/effects/mxn-fx-blink";
import { mxnBoilPivot } from "../mixins/mxn-boil-pivot";
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
            );

            scene.camera.mode = "controlled";
            yield* Coro.all([
                show("It's just that my friend is in trouble because of all of the sprites on Mount Flop."),
                interpvr(scene.camera).factor(factor.sine).to(lvl.PanToHouseRegion0).over(3000),
            ]);
            yield interpvr(scene.camera).factor(factor.sine).to(lvl.PanToHouseRegion2).over(3000);

            yield* ask("Think you can help him?", "I will try!");
            yield* show("Thank you. He is known to have really cool items. Maybe he'll give you something nice.");
        });

    if (!gift.isGiveable()) {
        lvl.TownSignageHelp.destroy();
        return;
    }

    lvl.TownSignageHelp
        .mixin(mxnBoilPivot)
        .mixin(mxnFxBlink, 1.5);
}
