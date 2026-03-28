import { Graphics, TilingSprite } from "pixi.js";
import { Tx } from "../../../assets/textures";
import { approachLinear } from "../../../lib/math/number";
import { Integer } from "../../../lib/math/number-alias-types";
import { container } from "../../../lib/pixi/container";
import { MapRgbFilter } from "../../../lib/pixi/filters/map-rgb-filter";
import { mxnDetectPlayer } from "../../mixins/mxn-detect-player";
import { mxnEnemy } from "../../mixins/mxn-enemy";
import { mxnEnemyDeathBurst } from "../../mixins/mxn-enemy-death-burst";
import { mxnRpgStatusGapeMouthOnDamage } from "../../mixins/mxn-rpg-status-gape-mouth-on-damage";
import { RpgEnemyRank } from "../../rpg/rpg-enemy-rank";
import { AngelThemeTemplate } from "./angel-theme-template";
import { objAngelMouth } from "./obj-angel-mouth";

const themes = (() => {
    const template = AngelThemeTemplate.create({
        eyes: {
            defaultEyelidRestingPosition: 0,
            eyelidsTint: 0xff0000,
            gap: 13,
            pupilRestStyle: { kind: "cross_eyed", offsetFromCenter: 3 },
            pupilsTx: Tx.Enemy.Brick.Pupil0,
            pupilsTint: 0x000000,
            pupilsMirrored: true,
            scleraTx: Tx.Enemy.Brick.Sclera0,
            sclerasMirrored: true,
        },
        mouth: {
            teethCount: 2,
            toothGapWidth: 1,
            negativeSpaceTint: 0x000000,
            txs: objAngelMouth.txs.w14,
        },
        sprites: {
            face: Tx.Enemy.Brick.Face0,
        },
        tints: {
            map: [0xd6b48e, 0xbe511e, 0xB20005] as MapRgbFilter.Map,
        },
    });

    return {
        common: template.createTheme(),
    };
})();

interface ObjAngelBrickArgs {
    width: Integer;
    height: Integer;
}

const ranks = {
    level0: RpgEnemyRank.create({
        status: {
            healthMax: 10,
            defenses: {
                physical: 99,
            },
        },
        loot: {
            tier0: [
                { weight: 10, kind: "flop", min: 98, max: 99 },
                { weight: 90, kind: "nothing" },
            ],
        },
        level: 1,
    }),
};

const variants = {
    level0: {
        rank: ranks.level0,
        theme: themes.common,
        txPattern: Tx.Enemy.Brick.Pattern0,
    },
};

export function objAngelBrick({ width, height }: ObjAngelBrickArgs) {
    const { rank, theme, txPattern } = variants.level0;

    const hurtboxObj = new Graphics().beginFill(0xff0000).drawRect(0, 0, width, height);
    const patternObj = new TilingSprite(txPattern, width + 2, height + 2);
    patternObj.tilePosition.at(-1, -1);
    const mouthObj = theme.createMouthObj();
    const faceObj = theme.createSprite("face");

    return container(
        hurtboxObj,
        patternObj.at(-1, -1),
        container(
            theme.createEyesObj().add(0, -5),
            mouthObj.add(0, 7),
            faceObj.anchored(0.5, 1).add(-1, 2),
        )
            .at(width / 2, height / 2)
            .vround(),
    )
        .mixin(mxnDetectPlayer)
        .mixin(mxnEnemy, { rank, hurtboxes: [hurtboxObj], soulAnchorObj: mouthObj })
        .mixin(mxnEnemyDeathBurst, { map: theme.tints.map })
        .mixin(mxnRpgStatusGapeMouthOnDamage, mouthObj)
        .handles("damaged", () => faceObj.pivot.y = 2)
        .step(() => faceObj.pivot.y = approachLinear(faceObj.pivot.y, 0, 0.2))
        .filtered(new MapRgbFilter(...theme.tints.map));
}
