import { Lvl } from "../../assets/generated/levels/generated-level-data";
import { Tx } from "../../assets/textures";
import { Instances } from "../../lib/game-engine/instances";
import { mxnSinePivot } from "../mixins/mxn-sine-pivot";
import { OgmoFactory } from "../ogmo/factory";

export function scnWorldMap() {
    Lvl.WorldMap();
    Instances(OgmoFactory.createDecal).filter(x => x.texture === Tx.WorldMap.Cloud0).forEach(x =>
        x.mixin(mxnSinePivot)
    );
}
