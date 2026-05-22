import { Sprite } from "pixi.js";
import { Tx } from "../../../assets/textures";
import { RgbInt } from "../../../lib/math/number-alias-types";
import { vnew } from "../../../lib/math/vector-type";
import { container } from "../../../lib/pixi/container";
import { MapRgbFilter } from "../../../lib/pixi/filters/map-rgb-filter";
import { ZIndex } from "../../core/scene/z-index";
import { mxnFxVibrate } from "../../mixins/effects/mxn-fx-vibrate";

interface ObjAngelBoyfriendsArgs {
    tints: {
        angry: RgbInt;
        sad: RgbInt;
        antlers: RgbInt;
    };
}

const [txIdle, txMove, txKissStart, txKiss, txPride] = Tx.Enemy.Boyfriends.Bodies.split({ width: 112 });

export function objAngelBoyfriends(args: ObjAngelBoyfriendsArgs) {
    const puppetObj = objAngelBoyfriendsPuppet()
        .filtered(new MapRgbFilter(args.tints.angry, args.tints.sad, args.tints.antlers));

    return container(
        puppetObj,
    )
        .zIndexed(ZIndex.Entities);
}

function objAngelBoyfriendsPuppet() {
    const api = {
        movementSpeed: vnew(),
        kissUnit: 0,
        isExpressingPride: false,
    };

    let pedometer = 0;

    const sprite = Sprite.from(txIdle);

    return container(
        sprite,
    )
        .merge({ objAngelBoyfriendsPuppet: api })
        .mixin(mxnFxVibrate)
        .step(() => {
            if (api.movementSpeed.x === 0 || api.movementSpeed.y !== 0) {
                pedometer = 0;
            }
            else {
                pedometer += Math.abs(api.movementSpeed.x);
            }
        })
        .step(() => {
            if (api.isExpressingPride) {
                sprite.texture = txPride;
            }
            else if (api.kissUnit > 0.9) {
                sprite.texture = txKiss;
            }
            else if (api.kissUnit > 0) {
                sprite.texture = txKissStart;
            }
            else if (api.movementSpeed.y !== 0) {
                sprite.texture = txMove;
            }
            else if (pedometer % 30 > 1 && pedometer % 30 < 16) {
                sprite.texture = txMove;
            }
            else {
                sprite.texture = txIdle;
            }
        });
}
