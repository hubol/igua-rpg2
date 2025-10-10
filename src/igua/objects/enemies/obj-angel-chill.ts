import { DisplayObject, Graphics, Sprite } from "pixi.js";
import { Tx } from "../../../assets/textures";
import { OneOrTwo } from "../../../lib/array/one-or-two";
import { factor, interpv } from "../../../lib/game-engine/routines/interp";
import { sleep } from "../../../lib/game-engine/routines/sleep";
import { RgbInt } from "../../../lib/math/number-alias-types";
import { vnew } from "../../../lib/math/vector-type";
import { container } from "../../../lib/pixi/container";
import { MapRgbFilter } from "../../../lib/pixi/filters/map-rgb-filter";
import { mxnDetectPlayer } from "../../mixins/mxn-detect-player";
import { mxnEnemy } from "../../mixins/mxn-enemy";
import { mxnEnemyDeathBurst } from "../../mixins/mxn-enemy-death-burst";
import { mxnFacingPivot } from "../../mixins/mxn-facing-pivot";
import { mxnRpgAttack } from "../../mixins/mxn-rpg-attack";
import { RpgAttack } from "../../rpg/rpg-attack";
import { RpgEnemyRank } from "../../rpg/rpg-enemy-rank";
import { objAngelEyes } from "./obj-angel-eyes";
import { objAngelMouth } from "./obj-angel-mouth";

const themes = (function () {
    const Common = {
        textures: {
            body: Tx.Enemy.Chill.Body.split({ count: 3 }),
            head: Tx.Enemy.Chill.Head0,
            mouth: objAngelMouth.txs.w36,
            pupil: Tx.Enemy.Chill.Pupil0,
            sclera: Tx.Enemy.Chill.Sclera0,
        },
        tints: {
            eyelids: 0x0000ff,
            map: [0xff0000, 0x00ff00, 0x0000ff] as MapRgbFilter.Map,
            pupils: [0x000000, 0x000000] as OneOrTwo<RgbInt>,
        },
    };

    return {
        Common,
    };
})();

const ranks = {
    level0: RpgEnemyRank.create({
        status: {
            healthMax: 999,
        },
        loot: {
            tier0: [
                { kind: "valuables", min: 100, max: 150, deltaPride: -10, weight: 30 },
                { kind: "pocket_item", count: 3, id: "ComputerChip", weight: 30 },
                { kind: "pocket_item", count: 5, id: "ComputerChip", weight: 20 },
                { kind: "flop", min: 60, max: 69, count: 5, weight: 20 },
            ],
            tier1: [
                { kind: "equipment", id: "NailFile", weight: 10 },
                { kind: "equipment", id: "PatheticCage", weight: 10 },
                { kind: "equipment", id: "PoisonRing", weight: 10 },
                { kind: "equipment", id: "RichesRing", weight: 10 },
                { kind: "equipment", id: "YellowRichesRing", weight: 10 },
                { kind: "potion", id: "RestoreHealth", count: 5, weight: 10 },
                { kind: "nothing", weight: 40 },
            ],
        },
    }),
};

type Theme = typeof themes[keyof typeof themes];

export function objAngelChill() {
    const rank = ranks.level0;
    const theme = themes.Common;

    const bodyObj = objAngelChillBody(theme);

    const hurtboxes = [
        new Graphics().beginFill(0xff0000).drawRect(-50, -32, 100, 42).invisible(),
        new Graphics().beginFill(0xffff00).drawRect(-32, 10, 64, 48).invisible(),
    ];

    const moves = {
        *shieldWithWeakpoint() {
            const leftAoeObj = new Graphics()
                .beginFill(0xff0000)
                .drawRect(0, 0, 32, 134)
                .at(-90, -134)
                .mixin(mxnRpgAttack, { attack: atkAoe, attacker: enemyObj.status })
                .mixin(mxnShield)
                .merge({ initialScale: vnew(1, 0) });

            const topAoeObj = new Graphics()
                .beginFill(0xff0000)
                .drawRect(-90, -134, 166, 32)
                .pivoted(76, 0)
                .at(76, 0)
                .mixin(mxnRpgAttack, { attack: atkAoe, attacker: enemyObj.status })
                .mixin(mxnShield)
                .merge({ initialScale: vnew(0, 1) });

            const rightAoeObj = new Graphics()
                .beginFill(0xff0000)
                .drawRect(55, -134, 32, 134)
                .mixin(mxnRpgAttack, { attack: atkAoe, attacker: enemyObj.status })
                .mixin(mxnShield)
                .merge({ initialScale: vnew(1, 0) });

            const rootObj = container(leftAoeObj, topAoeObj, rightAoeObj).at(enemyObj).show();

            const aoeObjs = [rightAoeObj, topAoeObj, leftAoeObj];
            const reversedAoeObjs = [...aoeObjs].reverse();

            for (const obj of aoeObjs) {
                obj.scale.at(obj.initialScale);
            }

            while (true) {
                for (const obj of aoeObjs) {
                    yield interpv(obj.scale).factor(factor.sine).to(1, 1).over(1000);
                    yield sleep(1000);
                }

                rootObj.scale.x *= -1;
                rootObj.pivot.x = rootObj.scale.x < 0 ? -3 : 0;

                for (const obj of reversedAoeObjs) {
                    yield interpv(obj.scale).to(obj.initialScale).over(1000);
                }
            }
        },
    };

    const soulAnchorObj = new Graphics().beginFill(0).drawRect(0, 0, 1, 1).at(0, 10).invisible();

    const enemyObj = container(bodyObj, objAngelChillHead(theme), ...hurtboxes, soulAnchorObj)
        .filtered(new MapRgbFilter(...theme.tints.map))
        .mixin(mxnDetectPlayer)
        .mixin(mxnEnemy, { hurtboxes, rank, soulAnchorObj })
        .mixin(mxnEnemyDeathBurst, { map: theme.tints.map })
        .pivoted(0, bodyObj.height - 3)
        .coro(function* () {
            yield* moves.shieldWithWeakpoint();
        });

    return enemyObj;
}

function objAngelChillBody(theme: Theme) {
    return container(
        Sprite.from(theme.textures.body[0]),
        Sprite.from(theme.textures.body[1]),
        Sprite.from(theme.textures.body[2]).mixin(mxnFacingPivot, { down: 1, up: -3, right: 3, left: -3 }),
    )
        .pivotedUnit(0.5, 0);
}

function objAngelChillHead(theme: Theme) {
    return container(
        container(
            Sprite.from(theme.textures.head).anchored(0.5, 0.8),
            container(
                objAngelMouth({
                    negativeSpaceTint: 0x000000,
                    teethCount: 3,
                    toothGapWidth: 2,
                    txs: theme.textures.mouth,
                })
                    .at(0, -8),
                objAngelEyes({
                    defaultEyelidRestingPosition: 6,
                    eyelidsTint: theme.tints.eyelids,
                    gap: 20,
                    pupilRestStyle: {
                        kind: "cross_eyed",
                        offsetFromCenter: 5,
                    },
                    pupilsTx: theme.textures.pupil,
                    pupilsTint: 0x000000,
                    scleraTx: theme.textures.sclera,
                })
                    .at(0, -24),
            )
                .mixin(mxnFacingPivot, { down: 6, up: -6, right: 6, left: -6 }),
        ),
    )
        .mixin(mxnFacingPivot, { down: 3, up: 0, right: 5, left: -5 });
}

function mxnShield(obj: DisplayObject) {
    return obj.step(() => {
        if (obj.is(mxnRpgAttack)) {
            obj.isAttackActive = obj.scale.x !== 0 && obj.scale.y !== 0;
        }
    });
}

const atkAoe = RpgAttack.create({
    emotional: 30,
});
