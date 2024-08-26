import { Lvl } from "../../assets/generated/levels/generated-level-data";
import { Mzk } from "../../assets/music";
import { Jukebox } from "../core/igua-audio";
import { show } from "../cutscene/show";
import { Input, scene } from "../globals";
import { mxnCutscene } from "../mixins/mxn-cutscene";
import { RpgProgress } from "../rpg/rpg-progress";

export function scnPotteryHouse() {
    Jukebox.play(Mzk.BigLove);

    const level = Lvl.Potter();
    scene.stage.step(() => {
        if (Input.justWentDown('CastSpell'))
            RpgProgress.character.attributes.intelligence += 1;
    })
    level.IguanaNpc.mixin(mxnCutscene, async () => {
        await show("Go away!");
        await level.IguanaNpc.walkTo(level.IguanaNpc.x + 100);
    });
}