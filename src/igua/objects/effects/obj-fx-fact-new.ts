import { Graphics, Sprite } from "pixi.js";
import { objText } from "../../../assets/fonts";
import { Sfx } from "../../../assets/sounds";
import { Tx } from "../../../assets/textures";
import { factor, interpc, interpvr } from "../../../lib/game-engine/routines/interp";
import { sleep } from "../../../lib/game-engine/routines/sleep";
import { container } from "../../../lib/pixi/container";
import { mxnBoilSeed } from "../../mixins/mxn-boil-seed";
import { mxnSinePivot } from "../../mixins/mxn-sine-pivot";
import { Rpg } from "../../rpg/rpg";
import { objFxBurstDusty } from "./obj-fx-burst-dusty";

export function objFxFactNew() {
    return container(Sprite.from(Tx.Effects.NewFact).mixin(mxnSinePivot))
        .pivoted(28, 32)
        .invisible()
        .coro(function* (self) {
            objFxFactNew.objFxBurst().at(self).show();
            yield sleep(200);
            self.visible = true;
            self.play(Sfx.Collect.FactNewText.rate(0.9, 1.1));
            yield interpvr(self).factor(factor.sine).translate(0, -20).over(200);

            yield sleep(350);

            self.play(Sfx.Collect.FactNewCapacity.rate(0.9, 1.1));
            const capacityObj = objCapacity().at(28, 60).show(self);
            yield interpvr(capacityObj).translate(0, -10).over(200);

            yield sleep(1200);
            self.play(Sfx.Collect.FactNewAway.rate(0.9, 1.1));
            yield interpvr(self).factor(factor.sine).translate(0, 20).over(200);
            self.destroy();
        });
}

objFxFactNew.objFxBurst = function objFxBurst () {
    return objFxBurstDusty()
        .coro(function* (self) {
            self.play(Sfx.Collect.FactNewAppear.rate(0.9, 1.1));
            yield interpc(self, "tint").steps(5).to(0xA074E8).over(200);
        });
};

function objCapacity() {
    const capacityTextObj = objText.Medium("Capacity:").anchored(1, 1);
    const textsObj = container(
        capacityTextObj,
        objText.MediumBoldIrregular(`${Rpg.character.facts.usedSlots} / ${Rpg.character.facts.totalSlots}`)
            .anchored(0, 1)
            .at(5, 0)
            .mixin(mxnBoilSeed),
    );

    const textsBgObj = new Graphics()
        .beginFill(0xffffff)
        .lineStyle({ alignment: 1, width: 4, color: 0xffffff })
        .drawRect(-capacityTextObj.width - 1, -11, textsObj.width, 8)
        .tinted(0xA074E8);

    return container(textsBgObj, textsObj)
        .pivoted(Math.round(textsObj.width / 2 - capacityTextObj.width), 0);
}
