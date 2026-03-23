import { Lvl, LvlType } from "../../assets/generated/levels/generated-level-data";
import { show } from "../drama/show";
import { mxnCutscene } from "../mixins/mxn-cutscene";
import { Rpg } from "../rpg/rpg";

export function scnFlopCollegeExterior() {
    const lvl = Lvl.FlopCollegeExterior();
    enrichDirector(lvl);
}

function enrichDirector(lvl: LvlType.FlopCollegeExterior) {
    if (Rpg.flags.classrooms.approvedForTeachingBy) {
        Rpg.flags.flopUniversity.isDirectorVisiting = true;
    }

    if (!Rpg.flags.flopUniversity.isDirectorVisiting) {
        lvl.DirectorNpc.destroy();
        lvl.WeightedPedestal.destroy();
        return;
    }

    lvl.DirectorNpc
        .mixin(mxnCutscene, function* () {
            if (lvl.WeightedPedestal.rpgWeightedPedestal.isSufficientlyWeighted) {
                yield* show(
                    "We're open for business!",
                    "By all means, please, go now to your pupils!!!",
                );
                return;
            }

            yield* show(
                "This is it, the future site of Flop University!",
                "It's always been my dream to open this school.",
                "Think you can help me by providing the necessary flops?",
            );
        });
}
