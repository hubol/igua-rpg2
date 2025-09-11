import { Sprite } from "pixi.js";
import { OgmoEntities } from "../../assets/generated/levels/generated-ogmo-project-data";
import { Tx } from "../../assets/textures";
import { interp } from "../../lib/game-engine/routines/interp";
import { ZIndex } from "../core/scene/z-index";
import { mxnInteract } from "../mixins/mxn-interact";
import { Rpg } from "../rpg/rpg";
import { SceneChanger } from "../systems/scene-changer";
import { playerObj } from "./obj-player";

export function objWorldMapGate(ogmo: OgmoEntities.GateMap) {
    const sceneChanger = SceneChanger.create(ogmo.values);

    return Sprite.from(Tx.WorldMap.Gate)
        .anchored(0.5, 0.5)
        .mixin(mxnInteract, () => {
            sceneChanger?.changeScene();
        })
        .coro(function* (self) {
            if (ogmo.values.visible || Rpg.programmaticFlags.revealedWorldMapGateUids.has(ogmo.uid)) {
                self.visible = true;
                return;
            }

            yield () => playerObj.collides(self);

            Rpg.programmaticFlags.revealedWorldMapGateUids.add(ogmo.uid);
            self.alpha = 0;
            self.visible = true;

            yield interp(self, "alpha").steps(3).to(1).over(250);
        })
        .zIndexed(ZIndex.CharacterEntities)
        .show();
}
