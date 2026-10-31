import { Graphics } from "pixi.js";
import { objText } from "../../../assets/fonts";
import { onPrimitiveMutate } from "../../../lib/game-engine/routines/on-primitive-mutate";
import { container } from "../../../lib/pixi/container";
import { range } from "../../../lib/range";
import { ZIndex } from "../../core/scene/z-index";
import { Rpg } from "../../rpg/rpg";

const consts = {
    width: 100,
    height: 60,
};

export function objEsotericSpiritExperienceGraph() {
    const axesGfx = new Graphics()
        .lineStyle(1, 0xAEB1CE)
        .moveTo(0, 0)
        .lineTo(consts.width, 0)
        .moveTo(0, 1)
        .lineTo(0, -consts.height);

    const dataGfx = new Graphics();

    const textObj = objText.SmallDigits("")
        .anchored(0, 1)
        .at(consts.width + 1, -consts.height - 1);

    return container(dataGfx, axesGfx, textObj)
        .coro(function* (self) {
            while (true) {
                self.visible = Rpg.character.attributes.intelligence >= 1;
                dataGfx.clear();
                const countTypeA = Rpg.inventory.pocket.count("EctoplasmTypeA");
                const countTypeB = Rpg.inventory.pocket.count("EctoplasmTypeB");
                const ectoplasmCount = countTypeA + countTypeB;
                const yValues = range(ectoplasmCount + 1).map(x =>
                    Rpg.experience.reward.spirit.compute.taxPocketItems(x, 0)
                );
                const maxX = Math.max(1, ectoplasmCount);
                const maxY = Math.max(maxX, yValues.last);

                dataGfx
                    .lineStyle(1, 0x73779F)
                    .moveTo(0, 0)
                    .lineTo(consts.width, -Math.round(consts.height * (maxX / maxY)));

                const tint = countTypeA > countTypeB ? 0x47FFDA : 0xD1D9FF;
                dataGfx
                    .lineStyle(1, tint)
                    .moveTo(0, 0);

                textObj.tint = tint;
                textObj.text = String(maxY);
                textObj.visible = ectoplasmCount > 0 && Rpg.character.attributes.intelligence >= 2;

                for (let x = 0; x < yValues.length; x++) {
                    dataGfx.lineTo(Math.round(consts.width * x / maxX), -Math.round(consts.height * yValues[x] / maxY));
                }

                yield onPrimitiveMutate(() =>
                    Rpg.inventory.pocket.totalItemsCount + Rpg.character.attributes.intelligence * 500
                );
            }
        })
        .zIndexed(ZIndex.FrontDecals + 1);
}
