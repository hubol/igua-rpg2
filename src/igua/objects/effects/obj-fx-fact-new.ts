import { Graphics, Sprite } from "pixi.js";
import { objText } from "../../../assets/fonts";
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
            objFxBurstDusty()
                .at(self)
                .coro(function* (self) {
                    yield interpc(self, "tint").steps(5).to(0xA074E8).over(200);
                })
                .show();
            yield sleep(200);
            self.visible = true;
            yield interpvr(self).factor(factor.sine).translate(0, -20).over(200);

            objCapacity().at(28, 50).show(self);

            yield sleep(1000);
            yield interpvr(self).factor(factor.sine).translate(0, 20).over(200);
            self.destroy();
        });
}

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
