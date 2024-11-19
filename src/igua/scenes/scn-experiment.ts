import { objText } from "../../assets/fonts";
import { Lvl } from "../../assets/generated/levels/generated-level-data";
import { Mzk } from "../../assets/music";
import { Jukebox } from "../core/igua-audio";
import { objAngelSuggestive } from "../objects/enemies/obj-angel-suggestive";
import { playerObj } from "../objects/obj-player";

export function scnExperiment() {
    Jukebox.play(Mzk.TrashDay);
    Lvl.Experiment();

    objAngelSuggestive().at([128, -128].add(playerObj)).show();

    objText.Tall(`The quick brown-fox jumps over the "brown", lazy dog?!...
THE QUICK BROWN FOX JUMPS OVER THE BROWN, LAZY DOG?!`).at(256, 256).show();
}
