import { Lvl } from "../../assets/generated/levels/generated-level-data";
import { show } from "../cutscene/show";
import { mxnCutscene } from "../mixins/mxn-cutscene";

export function scnForest() {
    const { NpcGoldilocks, NpcSatisfier } = Lvl.Forest();

    NpcGoldilocks.mixin(mxnCutscene, function* () {
        yield* show("A dense fog rolls in...");
        yield* show("In the distance, a silhouette...!");
        yield* show("The Satisfier!");
    });

    NpcSatisfier.mixin(mxnCutscene, function* () {
        yield* show("Hello. This forest is a tough place.");
        yield* show("You'll need to acquire a lot of different items to survive.");
        yield* show("If you bring me 150 leaves, I can create antidote.");
        yield* show("Without it, poison will greatly weaken you.");
    });
}
