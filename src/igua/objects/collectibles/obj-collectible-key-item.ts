import { Sprite } from "pixi.js";
import { Sfx } from "../../../assets/sounds";
import { Tx } from "../../../assets/textures";
import { Coro } from "../../../lib/game-engine/routines/coro";
import { interp, interpc, interpv } from "../../../lib/game-engine/routines/interp";
import { sleep } from "../../../lib/game-engine/routines/sleep";
import { Rng } from "../../../lib/math/rng";
import { vnew } from "../../../lib/math/vector-type";
import { container } from "../../../lib/pixi/container";
import { DataKeyItem } from "../../data/data-key-item";
import { mxnCollectibleLoot } from "../../mixins/mxn-collectible-loot";
import { mxnPhysics } from "../../mixins/mxn-physics";
import { mxnSparkling } from "../../mixins/mxn-sparkling";
import { Rpg } from "../../rpg/rpg";
import { objFxCollectKeyItemNotification } from "../effects/obj-fx-collect-key-item-notification";
import { objFigureKeyItem } from "../figures/obj-figure-key-item";
import { playerObj } from "../obj-player";
import { objIndexedSprite } from "../utils/obj-indexed-sprite";

export function objCollectibleKeyItem(keyItemId: DataKeyItem.Id) {
    const figureObj = objFigureKeyItem(keyItemId).mixin(mxnSparkling);

    if (figureObj instanceof Sprite) {
        figureObj.trimmed();
    }

    figureObj.pivot.set(Math.round(figureObj.width / 2), figureObj.height);

    return container(figureObj)
        .mixin(mxnCollectibleLoot)
        .mixin(mxnPhysics, { gravity: 0, physicsRadius: 8, physicsOffset: [0, -11] })
        .coro(function* (self) {
            self.play(Sfx.Collect.KeyItemAppear.rate(0.9, 1.1));

            self.scaled(0.5, 0.5);
            yield sleep(200);
            self.scaled(1, 1);

            const indicatorSpr = objIndicator()
                .anchored(0.5, 1)
                .at(0, -figureObj.height);

            self.addChildAt(indicatorSpr, 0);

            self.coro(function* () {
                yield* Coro.all([
                    interp(figureObj, "sparklesPerFrame").to(0.08).over(2000),
                    interpc(figureObj, "sparklesTint").to(0x2048AD).over(2000),
                ]);
            });
            yield sleep(400);

            self.speed.at(Math.sign(playerObj.x - self.x), -1);
            self.gravity = 0.1;

            yield () => self.isOnGround;

            self.play(Sfx.Collect.KeyItemLand.rate(0.9, 1.1));
            self.speed.x = 0;

            yield () => self.mxnCollectibleLoot.collectConditionsMet;

            objFxCollectKeyItemNotification(keyItemId).show().at(self);
            Rpg.inventory.keyItems.receive(keyItemId);

            indicatorSpr
                .merge({ intensity: 1, speed: vnew(Rng.float(-1, 1), -3) })
                .step(self => {
                    self.intensity += 0.1;
                    self.textureIndex = (self.textureIndex + 0.4 * self.intensity) % self.textures.length;
                    self.add(self.speed);
                    self.speed.y += 0.18;
                });
            indicatorSpr.visible = true;
            indicatorSpr.flash = false;

            yield* Coro.all([
                () => indicatorSpr.y >= 200,
                interpv(figureObj.scale).steps(4).to(3, 0).over(500),
            ]);

            self.destroy();
            // TODO more!!
        });
}

const indicatorTxs = (function () {
    const [first, ...rest] = Tx.Effects.KeyItemIndicator.split({ width: 18 });
    const [skip, ...more] = rest;
    return [first, ...rest, ...more.reverse()];
})();

function objIndicator() {
    return objIndexedSprite(indicatorTxs)
        .merge({ flash: true })
        .coro(function* (self) {
            while (self.flash) {
                yield sleep(1000);
                self.visible = !self.visible;
            }

            self.visible = true;
        });
}
