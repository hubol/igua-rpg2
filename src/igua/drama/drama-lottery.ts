import { Graphics } from "pixi.js";
import { objText } from "../../assets/fonts";
import { Sfx } from "../../assets/sounds";
import { factor, interpvr } from "../../lib/game-engine/routines/interp";
import { Integer } from "../../lib/math/number-alias-types";
import { container } from "../../lib/pixi/container";
import { range } from "../../lib/range";
import { layers } from "../globals";
import { MicrocosmLottery } from "../rpg/microcosms/microcosm-lottery";
import { DramaMisc } from "./drama-misc";
import { show } from "./show";

function* pickNumbers(lotteryCosm: MicrocosmLottery) {
    if (lotteryCosm.checkIsActive)

    const totalNumbersCount = lotteryCosm.config.normalNumbersCount + 1;

    const numbersObj = container()
        .at(0, 100)
        .coro(function* (self) {
            yield interpvr(self).factor(factor.sine).translate(135, 0).over(500);
        })
        .show(layers.overlay.messages);

    const graphicsObj = range(totalNumbersCount)
        .map(i =>
            new Graphics()
                .at(i * 36, 0)
                .beginFill(0xffffff)
                .drawCircle(0, 0, 16)
                .show(numbersObj)
        );

    numbersObj.pivot.x = numbersObj.width / 2;

    graphicsObj.last.tint = 0xff0000;

    const pickedNumbers = new Array<Integer>();

    while (pickedNumbers.length < totalNumbersCount) {
        const isLucky = pickedNumbers.length === lotteryCosm.config.normalNumbersCount;
        const max = lotteryCosm.config[isLucky ? "luckyNumberMax" : "normalNumbersMax"];
        const excludedNumbers = isLucky ? [] : pickedNumbers;

        while (true) {
            const integer = yield* DramaMisc.askInteger(
                `Pick a${isLucky ? " lucky" : ""} number.
[1 - ${max}]
${excludedNumbers.length ? "No repeats." : ""}`,
                {
                    min: 1,
                    max,
                    align: "right",
                },
            );

            if (excludedNumbers.includes(integer)) {
                Sfx.Interact.Error.play();
                yield* show("Already picked that number. Pick again.");
                continue;
            }

            objText.Large("" + integer, { tint: 0x000000 })
                .anchored(0.5, 0.5)
                .at(graphicsObj[pickedNumbers.length])
                .add(0, 2)
                .show(numbersObj);

            pickedNumbers.push(integer);
            break;
        }
    }

    yield interpvr(numbersObj).factor(factor.sine).to(250, numbersObj.y).over(1000);

    numbersObj.destroy();

    lotteryCosm.pickNumbers({
        lucky: pickedNumbers.last,
        normal: pickedNumbers.slice(0, lotteryCosm.config.normalNumbersCount),
    });
}

export const DramaLottery = {
    pickNumbers,
};
