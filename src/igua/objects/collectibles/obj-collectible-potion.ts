import { Graphics, Sprite } from "pixi.js";
import { Tx } from "../../../assets/textures";
import { factor, interpvr } from "../../../lib/game-engine/routines/interp";
import { sleep } from "../../../lib/game-engine/routines/sleep";
import { container } from "../../../lib/pixi/container";
import { DataPotion } from "../../data/data-potion";
import { objFigurePotion } from "../figures/obj-figure-potion";

const [dishTx, lidTx] = Tx.Effects.PotionServingDish.split({ count: 2 });

export function objCollectiblePotion(potionId: DataPotion.Id) {
    const figureObj = objFigurePotion(potionId);

    figureObj.pivot.x = Math.round(figureObj.width / 2);
    figureObj.pivot.y = figureObj.height;

    const maskObj = new Graphics().beginFill(0xffffff).drawRect(0, 0, 32, 1).pivoted(16, 0).scaled(1, 0).at(0, -3);

    const lidSpr = Sprite.from(lidTx).anchored(0.5, 1);

    return container(
        maskObj,
        figureObj.masked(maskObj),
        Sprite.from(dishTx).anchored(0.5, 1),
        lidSpr,
    )
        .coro(function* () {
            while (true) {
                lidSpr.y = 0;
                lidSpr.visible = true;
                yield sleep(250);
                yield interpvr(lidSpr).factor(factor.sine).to(0, -32).over(500);
                yield sleep(500);
                lidSpr.visible = false;
            }
        })
        .step(() => maskObj.scale.y = lidSpr.y);
}
