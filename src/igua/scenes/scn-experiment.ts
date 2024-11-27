import { Lvl } from "../../assets/generated/levels/generated-level-data";
import { Mzk } from "../../assets/music";
import { interp } from "../../lib/game-engine/routines/lerp";
import { sleep } from "../../lib/game-engine/routines/sleep";
import { Jukebox } from "../core/igua-audio";
import { objAngelSuggestive } from "../objects/enemies/obj-angel-suggestive";
import { playerObj } from "../objects/obj-player";
import { objValuableSpawner } from "../objects/obj-valuable-spawner";

export function scnExperiment() {
    Jukebox.play(Mzk.TrashDay);
    const lvl = Lvl.Experiment();

    objAngelSuggestive().at([128, -128].add(playerObj)).show();

    const valuableSpawnerObj = objValuableSpawner([lvl.MinerValuable0, lvl.MinerValuable1, lvl.MinerValuable2]);

    lvl.MinerPicaxeBurst.invisible();
    lvl.MinerPicaxe.coro(function* (self) {
        while (true) {
            yield interp.steps(4)(self, "angle").to(135).over(1000);
            yield () => !valuableSpawnerObj.isFull;
            yield sleep(250);
            yield interp.steps(4)(self, "angle").to(35).over(300);
            lvl.MinerPicaxeBurst.visible = true;
            yield sleep(125);
            valuableSpawnerObj.spawn();
            yield sleep(125);
            lvl.MinerPicaxeBurst.visible = false;
            yield sleep(250);
        }
    });
}
