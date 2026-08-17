import { objText } from "../../../assets/fonts";
import { Tx } from "../../../assets/textures";
import { txt } from "../../../lib/pixi/txt";

export function scnDevTxt() {
    objText.MediumIrregular(txt`Hello sucka, ${Tx.Collectibles.BallFruitTypeA} it's awesome now\nHave sex with me?`)
        .show();
}
