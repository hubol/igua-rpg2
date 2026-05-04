import { Graphics } from "pixi.js";
import { OgmoEntities } from "../../../../assets/generated/levels/generated-ogmo-project-data";
import { blendColor } from "../../../../lib/color/blend-color";
import { interpc } from "../../../../lib/game-engine/routines/interp";
import { sleep } from "../../../../lib/game-engine/routines/sleep";
import { Rng } from "../../../../lib/math/rng";
import { ZIndex } from "../../../core/scene/z-index";
import { mxnRpgAttack } from "../../../mixins/mxn-rpg-attack";
import { RpgAttack } from "../../../rpg/rpg-attack";
import { objFxCrackedEarth } from "../obj-fx-cracked-earth";

const atk = RpgAttack.create({
    conditions: {
        overheat: {
            damage: 50,
            value: 1,
        },
    },
});

export function objEnvironmentOverheatRegion(entity: OgmoEntities.OverheatRegion) {
    const width = entity.width!;
    delete entity.width;

    const fxCrackedEarthObj = objFxCrackedEarth(width)
        .coro(function* (self) {
            while (true) {
                yield sleep(Rng.int(100, 150));
                yield interpc(self.objFxCrackedEarth, "tint")
                    .steps(5)
                    .to(getCrackedEarthTint(Rng.float(0.4)))
                    .over(Rng.int(200, 300));
                yield sleep(Rng.int(100, 150));
                yield interpc(self.objFxCrackedEarth, "tint")
                    .steps(5)
                    .to(getCrackedEarthTint(Rng.float(0.6, 1)))
                    .over(Rng.int(200, 300));
            }
        });
    fxCrackedEarthObj.objFxCrackedEarth.tint = getCrackedEarthTint(Rng.float());

    const attackObj = new Graphics()
        .beginFill(0xff0000)
        .drawRect(0, -12, 1, 12)
        .invisible()
        .mixin(mxnRpgAttack, { attack: atk })
        .step(self => self.scale.x = fxCrackedEarthObj.objFxCrackedEarth.width)
        .show(fxCrackedEarthObj);

    return fxCrackedEarthObj
        .zIndexed(ZIndex.TerrainEntities);
}

function getCrackedEarthTint(blend: number) {
    return blendColor(0x6e1b0d, 0xffd900, blend);
}
