import { Lvl } from "../../assets/generated/levels/generated-level-data";
import { Mzk } from "../../assets/music";
import { interp } from "../../lib/game-engine/routines/lerp";
import { sleep } from "../../lib/game-engine/routines/sleep";
import { Jukebox } from "../core/igua-audio";
import { objAngelSuggestive } from "../objects/enemies/obj-angel-suggestive";
import { playerObj } from "../objects/obj-player";

export function scnExperiment() {
    Jukebox.play(Mzk.TrashDay);
    const lvl = Lvl.Experiment();

    objAngelSuggestive().at([128, -128].add(playerObj)).show();

    lvl.MinerPicaxeBurst.invisible();
    lvl.MinerPicaxe.coro(function* (self) {
        while (true) {
            yield interp.steps(4)(self, "angle").to(135).over(1000);
            yield sleep(250);
            yield interp.steps(4)(self, "angle").to(35).over(300);
            lvl.MinerPicaxeBurst.visible = true;
            yield sleep(250);
            lvl.MinerPicaxeBurst.visible = false;
            yield sleep(250);
        }
    });
}
