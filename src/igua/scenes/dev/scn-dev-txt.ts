import { Sprite } from "pixi.js";
import { objText } from "../../../assets/fonts";
import { Tx } from "../../../assets/textures";
import { container } from "../../../lib/pixi/container";
import { txt } from "../../../lib/pixi/txt";
import { DataNpcLooks } from "../../data/data-npc-looks";
import { DevKey } from "../../globals";
import { objIguanaPuppet } from "../../iguana/obj-iguana-puppet";

export function scnDevTxt() {
    const puppetObj = objIguanaPuppet(DataNpcLooks.AlphaMale);
    objText.Medium(
        txt`Hello sucka, ${Tx.Collectibles.BallFruitTypeA} it's awesome now

Be cool right now ${container(puppetObj).pivoted(-23, -40)} and lovely
so ${Sprite.from(Tx.Collectibles.Pocket.CactusFruitA).scaled(0.5, 0.5)} wonderful`,
    )
        .at(100, 100)
        .coro(function* (self) {
            yield () => DevKey.isUp("Space");
            yield () => DevKey.justWentDown("Space");
            self.text = "Ok!!";
            yield () => DevKey.isUp("Space");
            yield () => DevKey.justWentDown("Space");
            self.text = txt`Duuuuude ${Tx.Collectibles.BallFruitTypeA}`;
            yield () => DevKey.isUp("Space");
            yield () => DevKey.justWentDown("Space");
            self.text = txt`Text in text.
${objText.Large("Incredible fuck")}

What is the point?`;
            yield () => DevKey.isUp("Space");
            yield () => DevKey.justWentDown("Space");
            self.destroy();
            // Should throw:
            puppetObj.x = 99;
            // (It does)
        })
        .show();
}
