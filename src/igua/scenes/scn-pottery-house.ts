import { Lvl } from "../../assets/generated/levels/generated-level-data";
import { Mzk } from "../../assets/music";
import { sleep } from "../../lib/game-engine/promise/sleep";
import { container } from "../../lib/pixi/container";
import { Jukebox } from "../core/igua-audio";
import { show } from "../cutscene/show";
import { Input, scene } from "../globals";
import { mxnCutscene } from "../mixins/mxn-cutscene";
import { objAngelBouncing } from "../objects/enemies/obj-angel-bouncing";
import { playerObj } from "../objects/obj-player";
import { objValuableTrove } from "../objects/obj-valuable-trove";
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

    objAngelBouncing().at(playerObj).add(40, -16).show().handles('mxnEnemy.died', () => level.PotteryBodyYellow.alpha = 0.5);
    // level.UpperDoor.locked = true;

    container().async(async self => {
        while (true) {
            for (let i = 1; i < 300; i++) {
                const troveObj = objValuableTrove(i).at(self).show()
                await sleep(150);
                troveObj.destroy();
            }
        }
    }).at(160, 128).show();

    // for (let i = 0; i < 30; i++) {
    //     objValuableTrove(i + 1).at(
    //         (40 + i * 40) % scene.level.width,
    //         40 + Math.floor((i * 40) / scene.level.width) * 90)
    //     .show();
    // }
}