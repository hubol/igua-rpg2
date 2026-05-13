import { Graphics, Sprite } from "pixi.js";
import { Sfx } from "../../../assets/sounds";
import { Tx } from "../../../assets/textures";
import { sleepf } from "../../../lib/game-engine/routines/sleep";
import { Integer } from "../../../lib/math/number-alias-types";
import { Rng } from "../../../lib/math/rng";
import { container } from "../../../lib/pixi/container";
import { ZIndex } from "../../core/scene/z-index";
import { mxnInteract } from "../../mixins/mxn-interact";
import { playerObj } from "../obj-player";
import { objProjectileHotPineCone } from "../projectiles/obj-projectile-hot-pine-cone";

const pineConePositions = [
    [61, 31],
    [49, 65],
    [76, 89],
    [49, 106],
    [21, 121],
    [79, 130],
    [43, 146],
    [28, 166],
    [85, 163],
];

export function objEsotericHotPineConeTree() {
    const hotspotObj = new Graphics().beginFill(0xff0000).drawRect(0, 0, 2, 2)
        .at(57, 150)
        .invisible();

    let shakesCount = 0;

    const api = {
        gainPineCone() {
            const pineConeObj = pineConeObjs.find(obj => !obj.visible);
            if (!pineConeObj) {
                return;
            }
            pineConeObj.visible = true;
            pineConeObj.play(Sfx.Cutscene.FishTake.rate(0.5, 2));
        },
        releasePineCone(horizontalDirection: Integer) {
            const pineConeObj = pineConeObjs.find(obj => obj.visible);

            shakesCount = 5;

            if (!pineConeObj) {
                Sfx.Interact.Error.play();
                return;
            }

            // TODO sfx

            obj.dispatch("objEsotericHotPineConeTree.coneReleased");

            objProjectileHotPineCone()
                .at(pineConeObj.getWorldPosition())
                .show()
                .speed
                .at(horizontalDirection * 2, -2);
            pineConeObj.visible = false;
        },
    };

    const pineConeObjs = Rng.shuffle([...pineConePositions])
        .map(position => Sprite.from(Tx.Effects.HotPineCone).anchored(0.5, 0.5).at(position).invisible());

    const obj = container(
        Sprite.from(Tx.Esoteric.HotPineConeTree)
            .coro(function* (self) {
                while (true) {
                    yield () => shakesCount > 0;
                    shakesCount--;
                    if (shakesCount <= 0) {
                        self.x = 0;
                    }
                    else {
                        self.x = shakesCount % 2 === 0 ? 2 : -2;
                    }
                    yield sleepf(3);
                }
            }),
        hotspotObj,
        ...pineConeObjs,
    )
        .dispatches<"objEsotericHotPineConeTree.coneReleased">();

    return obj
        .merge({ objEsotericHotPineConeTree: api })
        .mixin(mxnInteract, () => api.releasePineCone(Math.sign(playerObj.facing)), hotspotObj)
        .pivoted(59, 198)
        .zIndexed(ZIndex.TerrainDecals);
}
