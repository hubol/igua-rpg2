import { Sprite } from "pixi.js";
import { Tx } from "../../assets/textures";
import { ZIndex } from "../core/scene/z-index";
import { mxnInteract } from "../mixins/mxn-interact";
import { OgmoFactory } from "../ogmo/factory";
import { SceneChanger } from "../systems/scene-changer";

export function objWorldMapGate(ogmo: OgmoFactory.Entity<"GateMap">) {
    const sceneChanger = SceneChanger.create(ogmo.values);

    return Sprite.from(Tx.WorldMap.Gate)
        .anchored(0.5, 0.5)
        .mixin(mxnInteract, () => {
            sceneChanger?.changeScene();
        })
        .zIndexed(ZIndex.CharacterEntities)
        .show();
}
