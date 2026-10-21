import { Graphics } from "pixi.js";
import { objText } from "../../assets/fonts";
import { Lvl } from "../../assets/generated/levels/generated-level-data";
import { container } from "../../lib/pixi/container";
import { ZIndex } from "../core/scene/z-index";
import { MxnRpgStatus } from "../mixins/mxn-rpg-status";
import { mxnSinePivot } from "../mixins/mxn-sine-pivot";
import { objAngelCactus } from "../objects/enemies/obj-angel-cactus";
import { objBuildUpBar } from "../objects/overlay/obj-build-up-bar";
import { Rpg } from "../rpg/rpg";

export function scnOhioHallPoison() {
    const lvl = Lvl.OhioHallPoison();

    objAngelCactus("level3")
        .mixin(mxnShowPoisonLevel)
        .at(lvl.EnemyMarker)
        .show();

    container()
        .step(() => {
            if (Rpg.character.buffs.combat.melee.conditions.poison.maxLevel > 0) {
                Rpg.character.temporaryEffects.add("MeleePoisonValueFromHall", 1);
            }
        })
        .show();
}

function mxnShowPoisonLevel(obj: MxnRpgStatus) {
    return obj
        .coro(function* () {
            container(
                new Graphics()
                    .beginFill(objBuildUpBar.tints.Poison.tintBack)
                    .drawCircle(0, 0, 9.5),
                objText.MediumBold("0", { tint: objBuildUpBar.tints.Poison.tintFront })
                    .at(0, 2)
                    .anchored(0.5, 0.5)
                    .step(self => self.text = String(obj.status.conditions.poison.level)),
            )
                .mixin(mxnSinePivot)
                .step(self => {
                    if (obj.destroyed) {
                        self.destroy();
                        return;
                    }
                    self.at(obj).add(0, -64);
                })
                .zIndexed(ZIndex.BackgroundEntities)
                .show();
        });
}
