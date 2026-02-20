import { Graphics, Sprite } from "pixi.js";
import { Tx } from "../../../assets/textures";
import { CollisionShape } from "../../../lib/pixi/collision";
import { container } from "../../../lib/pixi/container";
import { ValuesOf } from "../../../lib/types/values-of";
import { mxnDetectPlayer } from "../../mixins/mxn-detect-player";
import { mxnEnemy } from "../../mixins/mxn-enemy";
import { RpgEnemyRank } from "../../rpg/rpg-enemy-rank";
import { objIndexedSprite } from "../utils/obj-indexed-sprite";
import { AngelThemeTemplate } from "./angel-theme-template";
import { objAngelMouth } from "./obj-angel-mouth";

const themes = (() => {
    const template = AngelThemeTemplate.create({
        eyes: {
            defaultEyelidRestingPosition: 0,
            eyelidsTint: 0x55B53B,
            gap: 8,
            pupilRestStyle: { kind: "cross_eyed", offsetFromCenter: 3 },
            pupilsTx: Tx.Enemy.Snail.Pupil0,
            pupilsTint: 0x000000,
            pupilsMirrored: true,
            scleraTx: Tx.Enemy.Snail.Sclera0,
            sclerasMirrored: true,
        },
        mouth: {
            teethCount: 2,
            toothGapWidth: 1,
            negativeSpaceTint: 0x000000,
            txs: objAngelMouth.txs.rounded14,
        },
        sprites: {
            nose: Tx.Enemy.Cactus.Nose,
        },
        tints: {},
    });

    return {
        common: template.createTheme(),
    };
})();

type Theme = ValuesOf<typeof themes>;

const [txCactusBody, ...txsCactusSpikes] = Tx.Enemy.Cactus.Body.split({ count: 4 });

export function objAngelCactus() {
    const theme = themes.common;
    const rank = RpgEnemyRank.create({
        status: {
            healthMax: 80,
            guardingDefenses: {
                physical: 100,
            },
        },
    });

    const hurtboxObj = new Graphics()
        .beginFill(0xff0000)
        .drawRect(-23, -11, 43, 21)
        .invisible();

    return container(
        container(
            Sprite.from(txCactusBody),
            objAngelCactusSpikes(),
        )
            .pivoted(32, 27),
        theme.createEyesObj()
            .add(0, -6),
        theme.createMouthObj()
            .add(0, 0),
        theme.createSprite("nose")
            .anchored(0.5, 0.5)
            .add(-1, -4),
        hurtboxObj,
    )
        .pivoted(0, 10)
        .mixin(mxnDetectPlayer)
        .mixin(mxnEnemy, { hurtboxes: [hurtboxObj], rank });
}

function objAngelCactusSpikes() {
    const api = {
        scale: 0,
    };

    const collisionShapeObj = new Graphics()
        .beginFill(0xff0000)
        .drawRect(0, 0, 61, 43)
        .scaled(0, 0)
        .invisible();

    const sprite = objIndexedSprite(txsCactusSpikes)
        .step(self => {
            self.textureIndex = txsCactusSpikes.length * api.scale;
            collisionShapeObj.scale.set(self.effectiveTextureIndex >= (txsCactusSpikes.length - 1) ? 1 : 0);
        });

    return container(
        sprite,
        collisionShapeObj,
    )
        .collisionShape(CollisionShape.DisplayObjects, [collisionShapeObj]);
}
