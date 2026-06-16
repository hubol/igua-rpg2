import { Sprite, Texture } from "pixi.js";
import { Instances } from "../../lib/game-engine/instances";
import { OgmoFactory } from "../ogmo/factory";

export namespace Search {
    export function findDecals(tx: Texture, ...txs: Texture[]): Sprite[] {
        const txsSet = new Set([tx, ...txs]);
        return Instances(OgmoFactory.createDecal).filter(obj => txsSet.has(obj.texture));
    }
}
