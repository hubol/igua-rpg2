import { Lvl } from "../../assets/generated/levels/generated-level-data";
import { Mzk } from "../../assets/music";
import { Tx } from "../../assets/textures";
import { Instances } from "../../lib/game-engine/instances";
import { Jukebox } from "../core/igua-audio";
import { show } from "../drama/show";
import { mxnCutscene } from "../mixins/mxn-cutscene";
import { mxnSinePivot } from "../mixins/mxn-sine-pivot";
import { OgmoFactory } from "../ogmo/factory";
import { Rpg } from "../rpg/rpg";

export function scnErrorRecoveryRoom() {
    Jukebox.play(Mzk.BestSeller);
    const lvl = Lvl.ErrorRecoveryRoom();

    Rpg.character.position.sceneName = scnErrorRecoveryRoom.name;

    // TODO should be nice API for this
    Instances(OgmoFactory.createDecal)
        .filter(x => x.texture === Tx.Town.Signage.Warning)
        .forEach(x => x.mixin(mxnSinePivot));

    lvl.HubolNpc
        .mixin(mxnCutscene, function* () {
            yield* show("Sorry about the mess...");
        });
}
