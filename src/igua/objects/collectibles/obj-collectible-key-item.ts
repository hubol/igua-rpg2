import { Sprite } from "pixi.js";
import { Tx } from "../../../assets/textures";
import { Coro } from "../../../lib/game-engine/routines/coro";
import { interp, interpc } from "../../../lib/game-engine/routines/interp";
import { sleep } from "../../../lib/game-engine/routines/sleep";
import { Rng } from "../../../lib/math/rng";
import { container } from "../../../lib/pixi/container";
import { DataKeyItem } from "../../data/data-key-item";
import { mxnPhysics } from "../../mixins/mxn-physics";
import { mxnSparkling } from "../../mixins/mxn-sparkling";
import { Rpg } from "../../rpg/rpg";
import { objFxCollectKeyItemNotification } from "../effects/obj-fx-collection-key-item-notification";
import { objFigureKeyItem } from "../figures/obj-figure-key-item";
import { playerObj } from "../obj-player";

export function objCollectibleKeyItem(keyItemId: DataKeyItem.Id) {
    const figureObj = objFigureKeyItem(keyItemId).mixin(mxnSparkling);

    if (figureObj instanceof Sprite) {
        figureObj.trimmed();
    }

    figureObj.pivot.set(Math.round(figureObj.width / 2), figureObj.height);

    return container(figureObj)
        .mixin(mxnPhysics, { gravity: 0, physicsRadius: 8, physicsOffset: [0, -11] })
        .coro(function* (self) {
            self.scaled(0.5, 0.5);
            yield sleep(200);
            self.scaled(1, 1);
            self.coro(function* () {
                yield* Coro.all([
                    interp(figureObj, "sparklesPerFrame").to(0.08).over(2000),
                    interpc(figureObj, "sparklesTint").to(0x2048AD).over(2000),
                ]);

                const indicatorSpr = Sprite.from(Tx.Effects.KeyItemIndicator)
                    .anchored(0.5, 1)
                    .at(0, -figureObj.height);
                self.addChildAt(indicatorSpr, 0);

                while (true) {
                    yield sleep(1000);
                    indicatorSpr.visible = !indicatorSpr.visible;
                }
            });
            yield sleep(400);

            self.speed.at(Math.sign(playerObj.x - self.x), -1);
            self.gravity = 0.1;

            yield () => self.isOnGround;

            self.speed.x = 0;

            yield () => playerObj.hasControl && playerObj.collides(figureObj);

            objFxCollectKeyItemNotification(keyItemId).show().at(self);
            Rpg.inventory.keyItems.receive(keyItemId);
            self.destroy();
            // TODO more!!
        });
}
