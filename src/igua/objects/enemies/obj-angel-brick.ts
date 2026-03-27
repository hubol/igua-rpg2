import { Graphics } from "pixi.js";
import { Integer } from "../../../lib/math/number-alias-types";
import { container } from "../../../lib/pixi/container";
import { mxnEnemy } from "../../mixins/mxn-enemy";
import { mxnEnemyDeathBurst } from "../../mixins/mxn-enemy-death-burst";
import { RpgEnemyRank } from "../../rpg/rpg-enemy-rank";

interface ObjAngelBrickArgs {
    width: Integer;
    height: Integer;
}

const rank = RpgEnemyRank.create({
    status: {
        healthMax: 9999,
        conditions: {
            poison: {
                damageScale: 50,
                rateFactor: 1000,
            },
        },
    },
    loot: {
        tier0: [
            { weight: 10, kind: "flop", min: 98, max: 99 },
            { weight: 90, kind: "nothing" },
        ],
    },
});

export function objAngelBrick({ width, height }: ObjAngelBrickArgs) {
    const hurtboxObj = new Graphics().beginFill(0xff0000).drawRect(0, 0, width, height);

    return container(hurtboxObj)
        .mixin(mxnEnemy, { rank, hurtboxes: [hurtboxObj] })
        .mixin(mxnEnemyDeathBurst, { map: [0xff0000, 0xffff00, 0x0000ff] });
}
