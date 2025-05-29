import { DisplayObject } from "pixi.js";
import { scene } from "../globals";
import { scnWorldMap } from "../scenes/scn-world-map";

export function mxnIsWorldMap(obj: DisplayObject) {
    return obj.merge({ isWorldMap: scene.source === scnWorldMap });
}
