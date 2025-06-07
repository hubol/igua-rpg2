import { Container, DisplayObject } from "pixi.js";
import { lvlWorldMap } from "../../assets/generated/levels/lvl-world-map";
import { Tx } from "../../assets/textures";
import { Instances } from "../../lib/game-engine/instances";
import { mxnBoilPivot } from "../mixins/mxn-boil-pivot";
import { mxnSinePivot } from "../mixins/mxn-sine-pivot";
import { OgmoFactory } from "../ogmo/factory";

export function scnWorldMap() {
    const lvl = lvlWorldMap();
    Instances(OgmoFactory.createDecal).filter(x => x.texture === Tx.WorldMap.Cloud0).forEach(x =>
        x.mixin(mxnSinePivot)
    );
    Object.entries(lvl).flatMap(([key, value]) =>
        key.endsWith("Label") && value instanceof DisplayObject ? [value] : []
    ).forEach(x => x.mixin(mxnBoilPivot));
}
