import { Sprite } from "pixi.js";
import { interp } from "../../../lib/game-engine/routines/interp";
import { ZIndex } from "../../core/scene/z-index";
import { objSpriteCopy } from "../../objects/utils/obj-sprite-copy";

export function mxnFxSpriteGhost(sprite: Sprite) {
    const api = {
        perFrame: 0,
    };

    let value = 0;

    return sprite
        .step(() => {
            if (api.perFrame === 0) {
                value = 0;
                return;
            }

            value += api.perFrame;
            if (value < 1) {
                return;
            }

            objSpriteCopy(sprite)
                .at(sprite.getWorldPosition())
                .mixin(mxnGhost)
                .zIndexed(ZIndex.EnemyDeathBursts)
                .show();
            value %= 1;
        })
        .merge({ mxnFxSpriteGhost: api });
}

function mxnGhost(sprite: Sprite) {
    sprite.alpha = 0.75;
    return sprite
        .coro(function* () {
            yield interp(sprite, "alpha").steps(3).to(0).over(333);
            sprite.destroy();
        });
}
