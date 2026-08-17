import { objText } from "../../../assets/fonts";
import { Tx } from "../../../assets/textures";
import { txt } from "../../../lib/pixi/txt";

export function scnDevTxt() {
    objText.Large(txt`Hello sucka, ${Tx.Collectibles.BallFruitTypeA} it's awesome now\nBe cool and lovely`)
        .show();
}
