import { Lvl } from "../../assets/generated/levels/generated-level-data";
import { Integer } from "../../lib/math/number-alias-types";
import { PseudoRng, Rng } from "../../lib/math/rng";
import { Null } from "../../lib/types/null";
import { objFigureFlop } from "../objects/figures/obj-figure-flop";

export function scnIndianaHallFlopMemory() {
    Lvl.Dummy();

    // const prng = new PseudoRng(128_000);
    const prng = Rng;

    let dexNumberZeroIndexed = Null<Integer>();

    while (
        dexNumberZeroIndexed === null
        || !isFlopElligibleForMutation(dexNumberZeroIndexed)
    ) {
        dexNumberZeroIndexed = prng.intc(0, 998);
    }

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
function isFlopElligibleForMutation(dexNumberZeroIndexed: Integer): boolean {
    const args = objFigureFlop.getPrimitiveArgsFromDexNumber(dexNumberZeroIndexed);
    return args.accessory.front !== 14;
}
