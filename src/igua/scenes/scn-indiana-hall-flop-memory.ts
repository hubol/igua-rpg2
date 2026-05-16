import { Lvl } from "../../assets/generated/levels/generated-level-data";
import { PseudoRng } from "../../lib/math/rng";
import { Null } from "../../lib/types/null";
import { objFigureFlop } from "../objects/figures/obj-figure-flop";

export function scnIndianaHallFlopMemory() {
    Lvl.Dummy();

    const prng = new PseudoRng(128_000);

    const dexNumberZeroIndexed = prng.intc(0, 998);

    const sourceFigureObj = objFigureFlop(dexNumberZeroIndexed);
    sourceFigureObj
        .at(50, 50)
        .filtered(sourceFigureObj.objects.filter)
        .show();

    const mutantJsons = new Set<string>();
    for (let i = 0; i < 3; i++) {
        let mutantArgs = Null<objFigureFlop.PrimitiveFlopArgs>();
        while (mutantArgs === null || mutantJsons.has(JSON.stringify(mutantArgs))) {
            mutantArgs = objFigureFlop.getMutatedPrimitveFlopArgs(prng, dexNumberZeroIndexed, 1);
        }

        console.log(mutantArgs);

        mutantJsons.add(JSON.stringify(mutantArgs));

        const figureObj = objFigureFlop.objFromPrimitiveFlopArgs(mutantArgs)
            .at(100 + i * 50, 50)
            .show();

        figureObj.filtered(figureObj.objects.filter);
    }
}
