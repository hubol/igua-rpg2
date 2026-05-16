import { AlphaFilter, DisplayObject } from "pixi.js";
import { Lvl } from "../../assets/generated/levels/generated-level-data";
import { Sfx } from "../../assets/sounds";
import { interp } from "../../lib/game-engine/routines/interp";
import { sleep } from "../../lib/game-engine/routines/sleep";
import { Integer } from "../../lib/math/number-alias-types";
import { Rng } from "../../lib/math/rng";
import { container } from "../../lib/pixi/container";
import { Null } from "../../lib/types/null";
import { show } from "../drama/show";
import { Cutscene, scene } from "../globals";
import { mxnInteract } from "../mixins/mxn-interact";
import { objFigureFlop } from "../objects/figures/obj-figure-flop";

export function scnIndianaHallFlopMemory() {
    Lvl.Dummy();

    const picker = new MutateFlopNumberPicker();

    scene.stage
        .coro(function* () {
            while (true) {
                const number = picker.next();
                const testObj = objFlopMemoryTest(number)
                    .at(100, 180)
                    .show();
                yield () => testObj.destroyed;
            }
        });
}

class MutateFlopNumberPicker {
    private readonly _pickedSet = new Set<Integer>();

    private static _isFlopElligibleForMutation(dexNumberZeroIndexed: Integer): boolean {
        const args = objFigureFlop.getPrimitiveArgsFromDexNumber(dexNumberZeroIndexed);
        return args.accessory.front !== 14;
    }

    next() {
        let number = Null<Integer>();
        while (
            number === null || this._pickedSet.has(number)
            || !MutateFlopNumberPicker._isFlopElligibleForMutation(number)
        ) {
            number = Rng.intc(0, 998);
        }

        this._pickedSet.add(number);

        return number;
    }
}

function objFlopMemoryTest(dexNumberZeroIndexed: Integer) {
    return container()
        .coro(function* (self) {
            const sourceFigureObj = objFigureFlop(dexNumberZeroIndexed)
                .scaled(2, 2)
                .at(50, -50)
                .show(self);
            const alphaFilter = new AlphaFilter(0);
            sourceFigureObj.filters = [sourceFigureObj.objects.filter, alphaFilter];

            yield interp(alphaFilter, "alpha").steps(3).to(1).over(1000);
            yield sleep(1500);
            yield interp(alphaFilter, "alpha").steps(3).to(0).over(1000);

            yield sleep(1000);

            sourceFigureObj.destroy();

            objMutantFlops(dexNumberZeroIndexed, 3)
                .handles("objMutantFlops:correct", () => {
                    Cutscene.play(function* () {
                        yield* show("Correct!");
                        self.destroy();
                    });
                })
                .handles("objMutantFlops:incorrect", () => {
                    Cutscene.play(function* () {
                        Sfx.Interact.Error.play();
                        yield* show("WRONG!!!!!!!!!!");
                        self.destroy();
                    });
                })
                .show(self);
        });
}

function objMutantFlops(dexNumberZeroIndexed: Integer, mutantsCount: Integer) {
    return container()
        .dispatches<"objMutantFlops:correct">()
        .dispatches<"objMutantFlops:incorrect">()
        .coro(function* (self) {
            const sourceFigureObj = objFigureFlop(dexNumberZeroIndexed)
                .mixin(mxnInteract, () => self.dispatch("objMutantFlops:correct"));
            sourceFigureObj.filtered(sourceFigureObj.objects.filter);

            const mutantFigureObjs = createMutantFlopObjs(dexNumberZeroIndexed, mutantsCount)
                .map(obj => obj.mixin(mxnInteract, () => self.dispatch("objMutantFlops:incorrect")));

            Rng.shuffle([sourceFigureObj, ...mutantFigureObjs])
                .map((obj, i) => obj.at(i * 60, 0).show(self));
        });
}

function createMutantFlopObjs(dexNumberZeroIndexed: Integer, mutantsCount: Integer) {
    const flopObjs = new Array<DisplayObject>();

    const mutantJsons = new Set<string>();
    for (let i = 0; i < mutantsCount; i++) {
        let mutantArgs = Null<objFigureFlop.PrimitiveFlopArgs>();
        while (mutantArgs === null || mutantJsons.has(JSON.stringify(mutantArgs))) {
            mutantArgs = objFigureFlop.getMutatedPrimitveFlopArgs(Rng, dexNumberZeroIndexed, 1 + i);
        }

        mutantJsons.add(JSON.stringify(mutantArgs));

        const figureObj = objFigureFlop.objFromPrimitiveFlopArgs(mutantArgs);
        figureObj.filtered(figureObj.objects.filter);

        flopObjs.push(figureObj);
    }

    return flopObjs;
}
