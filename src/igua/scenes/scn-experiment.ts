import { Lvl } from "../../assets/generated/levels/generated-level-data";
import { Mzk } from "../../assets/music";
import { Jukebox } from "../core/igua-audio";
import { objAngelSuggestive } from "../objects/enemies/obj-angel-suggestive";
import { playerObj } from "../objects/obj-player";

export function scnExperiment() {
    Jukebox.play(Mzk.TrashDay);
    Lvl.Experiment();

    objAngelSuggestive().at([128, -128].add(playerObj)).show();
}
