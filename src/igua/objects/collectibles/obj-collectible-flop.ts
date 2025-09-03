import { Graphics, Sprite } from "pixi.js";
import { Sfx } from "../../../assets/sounds";
import { Tx } from "../../../assets/textures";
import { interp, interpvr } from "../../../lib/game-engine/routines/interp";
import { sleep, sleepf } from "../../../lib/game-engine/routines/sleep";
import { approachLinear, cyclic } from "../../../lib/math/number";
import { Integer } from "../../../lib/math/number-alias-types";
import { container } from "../../../lib/pixi/container";
import { scene } from "../../globals";
import { GenerativeMusicUtils } from "../../lib/generative-music-utils";
import { mxnCollectibleLoot } from "../../mixins/mxn-collectible-loot";
import { mxnPhysics } from "../../mixins/mxn-physics";
import { mxnRescue } from "../../mixins/mxn-rescue";
import { Rpg } from "../../rpg/rpg";
import { objFigureFlop } from "../figures/obj-figure-flop";
import { objIndexedSprite } from "../utils/obj-indexed-sprite";

const txs = {
    appear: Tx.Collectibles.Flop.Appear.split({ width: 12 }),
};

export function objCollectibleFlop(flopDexNumberZeroIndexed: Integer) {
    flopDexNumberZeroIndexed = cyclic(Math.round(flopDexNumberZeroIndexed), 0, 999);

    const appearObj = objIndexedSprite(txs.appear).anchored(0.5, 0.5);
    const figureObj = objFigureFlop(flopDexNumberZeroIndexed).invisible();

    const characterObj = container(appearObj, figureObj)
        .filtered(figureObj.objects.filter);

    const hitboxObj = new Graphics().beginFill(0).drawRect(-16, -20, 32, 40).invisible();

    return container(characterObj, hitboxObj)
        .mixin(mxnPhysics, { physicsRadius: 6, gravity: 0.1, physicsOffset: [0, 9] })
        .mixin(mxnCollectibleLoot)
        .mixin(mxnRescue)
        .step(self => {
            self.x = Math.max(0, Math.min(self.x, scene.level.width));
            if (self.isOnGround) {
                self.speed.x = approachLinear(self.speed.x, 0, 0.1);
            }
        })
        .coro(function* (self) {
            self.play(Sfx.Collect.FlopAppear.rate(0.9, 1.1));
            self.speed.y = -3;
            yield sleep(150);
            appearObj.textureIndex = 1;
            yield sleep(150);
            appearObj.textureIndex = 2;
            yield sleep(150);
            figureObj.scaled(0.5, 0.5).visible = true;
            yield sleep(300);
            figureObj.scaled(1, 1);
        })
        .coro(function* (self) {
            for (let i = 0; i < 8; i++) {
                yield sleep(150);
                characterObj.angle += 90;
            }

            objFigureFlop.dexNumber(flopDexNumberZeroIndexed).anchored(0.5, 0).at(0, 19).show(
                self,
            );

            // TODO SFX

            const newIndicatorObj = Sprite.from(Tx.Ui.NewIndicator).anchored(0.5, 0.5).at(18, 14).show(self);
            const newIndicatorVisibleObj = container().step(() =>
                newIndicatorObj.visible = !Rpg.inventory.flops.has(flopDexNumberZeroIndexed)
            ).show(self);

            yield sleepf(2);
            yield () => self.mxnCollectibleLoot.collectConditionsMet;
            self.play(Sfx.Collect.Flop.rate(0.9, 1.1));
            newIndicatorVisibleObj.destroy();
            Rpg.inventory.flops.receive(flopDexNumberZeroIndexed);
            self.physicsEnabled = false;
            self.speed.at(0, 0);
            yield interpvr(self).translate(0, -32).over(200);
            if (newIndicatorObj.visible) {
                self.play(Sfx.Collect.FlopNew.rate(0.9, 1.1));
            }
            yield interp(newIndicatorObj, "angle").steps(8).to(360).over(400);
            yield sleep(1000);

            const tune = GenerativeMusicUtils.tune4("major");
            for (let i = 0; i < 4; i++) {
                const { value: rate } = tune.next();
                if (rate) {
                    self.play(Sfx.Collect.FlopFlash.rate(rate));
                }
                self.visible = !self.visible;
                yield sleep(100);
            }
            self.destroy();
        });
}
