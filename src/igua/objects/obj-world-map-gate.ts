import { Sprite } from "pixi.js";
import { OgmoEntities } from "../../assets/generated/levels/generated-ogmo-project-data";
import { Sfx } from "../../assets/sounds";
import { Tx } from "../../assets/textures";
import { interp } from "../../lib/game-engine/routines/interp";
import { ZIndex } from "../core/scene/z-index";
import { mxnInteract } from "../mixins/mxn-interact";
import { mxnMotion } from "../mixins/mxn-motion";
import { Rpg } from "../rpg/rpg";
import { SceneChanger } from "../systems/scene-changer";
import { FxPattern } from "./effects/lib/fx-pattern";
import { objFxAsterisk16Px } from "./effects/obj-fx-asterisk-16px";
import { objFxBurst32 } from "./effects/obj-fx-burst-32";
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

            self.play(Sfx.Interact.WorldMapGateAppear0.rate(0.9, 1.1));

            Rpg.programmaticFlags.revealedWorldMapGateUids.add(ogmo.uid);
            self.alpha = 0;
            self.visible = true;

            yield interp(self, "alpha").steps(3).to(1).over(250);

            self.play(Sfx.Interact.WorldMapGateAppear1.rate(0.9, 1.1));

            for (const { normal, position } of FxPattern.getRadialBurst({ count: 5, radius: [24, 29] })) {
                objFxAsterisk16Px().at(self).add(position).mixin(mxnMotion).show().speed.at(normal).scale(0.2, 0.2);
            }
        })
        .zIndexed(ZIndex.CharacterEntities)
        .show();
}
