import { Lvl } from "../../assets/generated/levels/generated-level-data";
import { show } from "../cutscene/show";
import { mxnCutscene } from "../mixins/mxn-cutscene";

export function scnForest() {
    const { NpcGoldilocks, NpcSatisfier } = Lvl.Forest();

    NpcGoldilocks.mixin(mxnCutscene, async () => {
        await show("A dense fog rolls in...");
        await show("In the distance, a silhouette...!");
        await show("The Satisfier!");
    });

    NpcSatisfier.mixin(mxnCutscene, async () => {
        await show("Hello. This forest is a tough place.");
        await show("You'll need to acquire a lot of different items to survive.");
        await show("If you bring me 150 leaves, I can create antidote.");
        await show("Without it, poison will greatly weaken you.");
    });
}