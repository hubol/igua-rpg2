import { Lvl } from "../../assets/generated/levels/generated-level-data";
import { Tx } from "../../assets/textures";
import { Instances } from "../../lib/game-engine/instances";
import { show } from "../drama/show";
import { mxnCutscene } from "../mixins/mxn-cutscene";
import { mxnSinePivot } from "../mixins/mxn-sine-pivot";
import { OgmoFactory } from "../ogmo/factory";

export function scnErrorRecoveryRoom() {
    const lvl = Lvl.ErrorRecoveryRoom();

    // TODO should be nice API for this
    Instances(OgmoFactory.createDecal)
        .filter(x => x.texture === Tx.Town.Signage.Warning)
        .forEach(x => x.mixin(mxnSinePivot));

    lvl.HubolNpc
        .mixin(mxnCutscene, function* () {
            yield* show("Sorry about the mess...");
        });
}
