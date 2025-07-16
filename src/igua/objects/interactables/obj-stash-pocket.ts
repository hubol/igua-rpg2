import { Sprite } from "pixi.js";
import { OgmoEntities } from "../../../assets/generated/levels/generated-ogmo-project-data";
import { Tx } from "../../../assets/textures";
import { mxnInteract } from "../../mixins/mxn-interact";

export function objStashPocket(entity: OgmoEntities.StashPocket) {
    return Sprite.from(Tx.Esoteric.StashPocket)
        .pivoted(23, 33)
        .mixin(mxnInteract, () => {});
}
