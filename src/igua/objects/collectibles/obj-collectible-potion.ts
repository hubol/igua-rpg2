import { Graphics, Sprite } from "pixi.js";
import { Tx } from "../../../assets/textures";
import { Coro } from "../../../lib/game-engine/routines/coro";
import { factor, interp, interpvr } from "../../../lib/game-engine/routines/interp";
import { sleep } from "../../../lib/game-engine/routines/sleep";
import { Rng } from "../../../lib/math/rng";
import { container } from "../../../lib/pixi/container";
import { DataPotion } from "../../data/data-potion";
import { mxnPhysics } from "../../mixins/mxn-physics";
import { mxnSinePivot } from "../../mixins/mxn-sine-pivot";
import { Rpg } from "../../rpg/rpg";
import { objFxCollectPotionNotification } from "../effects/obj-fx-collect-potion-notification";
import { objFigurePotion } from "../figures/obj-figure-potion";
import { playerObj } from "../obj-player";
import { objIndexedSprite } from "../utils/obj-indexed-sprite";

const [dishTx, lidTx] = Tx.Effects.PotionServingDish.split({ count: 2 });
const potionStinkLinesTxs = Tx.Effects.PotionStinkLines.split({ width: 38 });

export function objCollectiblePotion(potionId: DataPotion.Id) {
    const stinkLineTint = DataPotion.getById(potionId).stinkLineTint;
    const figureObj = objFigurePotion(potionId);

    figureObj.pivot.x = Math.round(figureObj.width / 2);
    figureObj.pivot.y = figureObj.height;

    const maskObj = new Graphics().beginFill(0xffffff).drawRect(0, 0, 32, 1).pivoted(16, 0).scaled(1, 0).at(0, -3);

    const dishSpr = Sprite.from(dishTx).anchored(0.5, 1);
    const lidSpr = Sprite.from(lidTx).anchored(0.5, 1);

    return container(
        maskObj,
        figureObj.masked(maskObj),
        dishSpr,
        lidSpr,
    )
        .mixin(mxnPhysics, { gravity: 0.2, physicsRadius: 16, physicsOffset: [0, -19] })
        .coro(function* (self) {
            yield () => self.isOnGround;

            yield sleep(250);
            yield interpvr(lidSpr).factor(factor.sine).to(0, -32).over(500);
            yield sleep(250);
            lidSpr.alpha = 0.5;
            dishSpr.alpha = 0.5;
            yield sleep(250);
            lidSpr.visible = false;
            dishSpr.visible = false;

            figureObj.mask = null;
            maskObj.visible = false;

            yield sleep(250);
            const stinkLinesObj = objIndexedSprite(potionStinkLinesTxs)
                .anchored(0.5, 1)
                .mixin(mxnSinePivot)
                .coro(function* (self) {
                    while (true) {
                        yield sleep(Rng.int(60, 120));
                        yield interp(self, "textureIndex").to(2).over(Rng.int(250, 500));
                        yield sleep(Rng.int(120, 250));
                        yield interp(self, "textureIndex").to(0).over(Rng.int(250, 500));
                        yield sleep(Rng.int(60, 120));
                        if (Rng.bool()) {
                            self.scale.x *= -1;
                        }
                    }
                })
                .at(0, -24)
                .show(self)
                .tinted(stinkLineTint);

            yield () => playerObj.hasControl && playerObj.collides(figureObj);

            figureObj.y += 3;

            stinkLinesObj.alpha = 0.5;

            yield sleep(100);

            figureObj.y -= 3;

            yield sleep(100);

            Rpg.inventory.potions.receive(potionId);
            stinkLinesObj.destroy();

            yield* Coro.all([
                interpvr(figureObj).factor(factor.sine).translate(Rng.int(-32, 32), -300).over(1000),
                Coro.chain([
                    interpvr(figureObj.pivot).to([figureObj.width, figureObj.height].scale(0.5).vround()).over(60),
                    interp(figureObj, "angle").steps(4 * 4).to(360 * 4).over(1300),
                ]),
                Coro.chain([sleep(100), () => (objFxCollectPotionNotification().at(self).show(), true)]),
            ]);
            self.destroy();
        })
        .step(() => maskObj.scale.y = lidSpr.y);
}
