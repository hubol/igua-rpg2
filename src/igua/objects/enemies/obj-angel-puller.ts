import { Sprite } from "pixi.js";
import { Tx } from "../../../assets/textures";
import { interp } from "../../../lib/game-engine/routines/interp";
import { sleep } from "../../../lib/game-engine/routines/sleep";
import { Rng } from "../../../lib/math/rng";
import { container } from "../../../lib/pixi/container";
import { ZIndex } from "../../core/scene/z-index";
import { mxnDetectPlayer } from "../../mixins/mxn-detect-player";
import { mxnEnemy } from "../../mixins/mxn-enemy";
import { mxnFacingPivot } from "../../mixins/mxn-facing-pivot";
import { RpgEnemyRank } from "../../rpg/rpg-enemy-rank";
import { RpgStatus } from "../../rpg/rpg-status";
import { objIndexedSprite } from "../utils/obj-indexed-sprite";
import { AngelThemeTemplate } from "./angel-theme-template";
import { objAngelMouth } from "./obj-angel-mouth";

const [txArmLow, txArmMiddle, txArmHigh, txTorso, txHead, txFaceDemo] = Tx.Enemy.Puller.Layers.split({ width: 50 });

const themes = (() => {
    const common = AngelThemeTemplate.create({
        eyes: {
            defaultEyelidRestingPosition: 0,
            eyelidsTint: 0xF291D8,
            gap: 5,
            pupilRestStyle: {
                kind: "cross_eyed",
                offsetFromCenter: 0,
            },
            pupilsTint: 0x000000,
            pupilsTx: Tx.Enemy.Puller.Pupil,
            scleraTx: Tx.Enemy.Puller.Sclera,
        },
        mouth: {
            txs: objAngelMouth.txs.v7,
            negativeSpaceTint: 0x000000,
            teethCount: 1,
            toothGapWidth: 1,
        },
        sprites: {},
        tints: {},
    })
        .createTheme();

    return {
        common,
    };
})();

const ranks = {
    level0: RpgEnemyRank.create({}),
};

export function objAngelPuller() {
    const theme = themes.common;
    const rank = ranks.level0;
    const armObj = objIndexedSprite([txArmLow, txArmMiddle, txArmHigh].reverse());

    return container(
        armObj,
        Sprite.from(txTorso),
        container(
            Sprite.from(txHead),
            container(
                theme.createEyesObj(),
                theme.createMouthObj()
                    .coro(function* (self) {
                        self.controls.frowning = true;
                    })
                    .add(0, 5),
            )
                .add(29, 19)
                .mixin(mxnFacingPivot, { right: 8, left: -8, down: 2, up: -2 }),
        )
            .mixin(mxnFacingPivot, { right: 2, left: -2, down: 0, up: 0 }),
    )
        .mixin(mxnEnemy, { rank, hurtboxes: [] })
        .mixin(mxnDetectPlayer)
        .coro(function* (self) {
            const leverObj = objAngelPuller.objLever()
                .at(self)
                .add(-39, -31)
                .show();

            armObj
                .step(self => self.textureUnit = leverObj.objAngelPullerLever.handlePulledUnit);

            while (true) {
                yield sleep(Rng.intc(1000, 1500));
                yield* leverObj.objAngelPullerLever.coroPull(self.status);
            }
        })
        .pivoted(29, 53)
        .zIndexed(ZIndex.CharacterEntities);
}

const txsLever = Tx.Enemy.Puller.Lever.split({ count: 2 });

objAngelPuller.objLever = function objAngelPullerLever () {
    const api = {
        handlePulledUnit: 0,
        coroPull,
    };

    function* coroPull(attacker: RpgStatus.Model) {
        yield interp(api, "handlePulledUnit").to(1).over(250);
        yield sleep(100);
        // TODO attack
        yield interp(api, "handlePulledUnit").to(0).over(400);
    }

    const handleObj = Sprite.from(txsLever[1]);

    return container(
        Sprite.from(txsLever[0]),
        handleObj,
    )
        .merge({ objAngelPullerLever: api })
        .zIndexed(ZIndex.BackgroundEntities);
};
