import { Container } from "pixi.js";
import { Lvl } from "../../assets/generated/levels/generated-level-data";
import { RgbInt } from "../../lib/math/number-alias-types";
import { Rng } from "../../lib/math/rng";
import { container } from "../../lib/pixi/container";
import { mxnRpgKill } from "../mixins/mxn-rpg-kill";
import { mxnSinePivot } from "../mixins/mxn-sine-pivot";
import { mxnSparkling } from "../mixins/mxn-sparkling";
import { playerObj } from "../objects/obj-player";
import { Search } from "../utils/search";

export function scnOhioCemetery() {
    const lvl = Lvl.OhioCemetery();
    lvl.WaterGroup
        .children
        .forEach(obj => obj.mixin(mxnSinePivot));

    lvl.PlayerKillRegion.mixin(mxnRpgKill);
    enrichEctoplasmActivity(0xff007a);
}

function enrichEctoplasmActivity(regionTint: RgbInt) {
    const headstoneObjs = Search.findRegions(regionTint)
        .sort((a, b) => a.x - b.x)
        .map(mxnHeadstone);

    container()
        .coro(function* () {
            let index = Rng.int(headstoneObjs.length);
            while (true) {
                const headstoneObj = headstoneObjs[index];
                headstoneObj.sparklesPerFrame = 0.3;
                yield () => headstoneObj.mxnHeadstone.isPlayerPerched;
                headstoneObj.sparklesPerFrame = 0;
                if (index === 0) {
                    index += 1;
                }
                else if (index === headstoneObjs.length - 1) {
                    index -= 1;
                }
                else {
                    index += Rng.intp();
                }
            }
        })
        .show();
}

function mxnHeadstone(obj: Container) {
    const api = {
        get isPlayerPerched() {
            return playerObj.y < obj.y + obj.height && playerObj.isOnGround && playerObj.collides(obj);
        },
    };

    return obj
        .merge({ mxnHeadstone: api })
        .mixin(mxnSparkling);
}
