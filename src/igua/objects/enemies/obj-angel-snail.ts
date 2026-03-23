import { Graphics } from "pixi.js";
import { Tx } from "../../../assets/textures";
import { approachLinear } from "../../../lib/math/number";
import { container } from "../../../lib/pixi/container";
import { MapRgbFilter } from "../../../lib/pixi/filters/map-rgb-filter";
import { ValuesOf } from "../../../lib/types/values-of";
import { mxnDetectPlayer } from "../../mixins/mxn-detect-player";
import { mxnEnemy } from "../../mixins/mxn-enemy";
import { mxnRpgStatusBodyPart } from "../../mixins/mxn-rpg-status-body-part";
import { mxnSinePivot } from "../../mixins/mxn-sine-pivot";
import { RpgEnemyRank } from "../../rpg/rpg-enemy-rank";
import { AngelThemeTemplate } from "./angel-theme-template";
import { objAngelMouth } from "./obj-angel-mouth";

const [txShell, txNoggin] = Tx.Enemy.Snail.GiantBody.split({ count: 2 });

const themes = (() => {
    const template = AngelThemeTemplate.create({
        eyes: {
            defaultEyelidRestingPosition: 10,
            eyelidsTint: 0x00ff00,
            gap: 4,
            pupilRestStyle: { kind: "cross_eyed", offsetFromCenter: 3 },
            pupilsTx: Tx.Enemy.Snail.GiantPupil0,
            pupilsTint: 0x0000ff,
            pupilsMirrored: true,
            scleraTx: Tx.Enemy.Snail.GiantSclera0,
            sclerasMirrored: true,
        },
        mouth: {
            teethCount: 2,
            toothGapWidth: 1,
            negativeSpaceTint: 0x0000ff,
            txs: objAngelMouth.txs.w36,
        },
        sprites: {
            shell: txShell,
            noggin: txNoggin,
            decorations: Tx.Enemy.Snail.Decorations0,
        },
        tints: {
            map: [0xb9c50c, 0x1a0b92, 0x477a0c] as MapRgbFilter.Map,
        },
    });

    return {
        common: template.createTheme(),
    };
})();

type Theme = ValuesOf<typeof themes>;

export function objAngelSnail() {
    const theme = themes.common;
    const rank = RpgEnemyRank.create({
        status: {
            healthMax: 80,
        },
    });

    const hurtboxObj = new Graphics()
        .beginFill(0xff0000)
        .drawRect(124, 24, 68, 103)
        .invisible();

    const immuneHurtboxObj = new Graphics()
        .beginFill(0xffff00)
        .drawRect(16, 5, 105, 112)
        .mixin(mxnRpgStatusBodyPart, { defenses: { physical: 100 } })
        .invisible();

    const mouthObj = theme.createMouthObj();
    const headObj = container(
        theme.createSprite("noggin"),
        container(
            mouthObj.add(0, 23),
            theme.createEyesObj(),
            theme.createSprite("decorations").add(-62, -4),
        )
            .at(157, 34),
    )
        .mixin(mxnSinePivot);

    let stepsSinceDamage = 9999;

    return container(
        container(theme.createSprite("shell"), headObj)
            .filtered(new MapRgbFilter(...theme.tints.map)),
        hurtboxObj,
        immuneHurtboxObj,
    )
        .pivoted(91, 129)
        .mixin(mxnDetectPlayer)
        .mixin(mxnEnemy, { rank, hurtboxes: [hurtboxObj, immuneHurtboxObj] })
        .handles("damaged", (_, result) => {
            if (!result.rejected) {
                mouthObj.controls.frowning = result.damaged === true;
                mouthObj.controls.teethExposedUnit = result.damaged ? 0 : 1;
            }
            stepsSinceDamage = 0;
        })
        .step(() => {
            stepsSinceDamage++;
            mouthObj.controls.agapeUnit = approachLinear(
                mouthObj.controls.agapeUnit,
                stepsSinceDamage < 60 ? 1 : 0,
                0.1,
            );
            if (mouthObj.controls.agapeUnit === 0) {
                mouthObj.controls.frowning = false;
            }
        });
}
