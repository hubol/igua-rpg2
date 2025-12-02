import { Graphics } from "pixi.js";
import { Tx } from "../../../assets/textures";
import { interp } from "../../../lib/game-engine/routines/interp";
import { sleep } from "../../../lib/game-engine/routines/sleep";
import { container } from "../../../lib/pixi/container";
import { MapRgbFilter } from "../../../lib/pixi/filters/map-rgb-filter";
import { ValuesOf } from "../../../lib/types/values-of";
import { mxnDetectPlayer } from "../../mixins/mxn-detect-player";
import { mxnEnemy } from "../../mixins/mxn-enemy";
import { mxnPhysics } from "../../mixins/mxn-physics";
import { RpgEnemyRank } from "../../rpg/rpg-enemy-rank";
import { objIndexedSprite } from "../utils/obj-indexed-sprite";
import { AngelThemeTemplate } from "./angel-theme-template";
import { objAngelMouth } from "./obj-angel-mouth";

const [txShell, ...txBody] = Tx.Enemy.Snail.Body.split({ width: 48 });

const themes = (() => {
    const template = AngelThemeTemplate.create({
        eyes: {
            defaultEyelidRestingPosition: 0,
            eyelidsTint: 0xff0000,
            gap: 4,
            pupilRestStyle: { kind: "cross_eyed", offsetFromCenter: 3 },
            pupilsTx: Tx.Enemy.Snail.Pupil0,
            pupilsTint: 0x0000ff,
            pupilsMirrored: true,
            scleraTx: Tx.Enemy.Snail.Sclera0,
            sclerasMirrored: true,
        },
        mouth: {
            teethCount: 2,
            toothGapWidth: 1,
            negativeSpaceTint: 0x000000,
            txs: objAngelMouth.txs.horizontal10,
        },
        sprites: {
            shell: txShell,
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
            guardingDefenses: {
                physical: 100,
            },
        },
    });

    const bodyObj = objAngelSnailBody(theme);
    const hurtboxObj = new Graphics()
        .beginFill(0xff0000)
        .drawRect(-7, -32, 32, 32)
        .step(self => {
            // TODO this is pretty shitty
            // Dynamic hurtboxes should not be so hard
            self.x = bodyObj.controls.exposedUnit < 0.1 ? -9 : 0;
            self.y = bodyObj.controls.exposedUnit < 0.1 ? 2 : 0;
        })
        .invisible();

    return container(
        hurtboxObj,
        container(theme.createSprite("shell"), bodyObj)
            .pivoted(20, 45)
            .filtered(new MapRgbFilter(...theme.tints.map)),
    )
        .mixin(mxnPhysics, { gravity: 0.2, physicsRadius: 8, physicsOffset: [0, -8] })
        .mixin(mxnDetectPlayer)
        .mixin(mxnEnemy, { rank, hurtboxes: [hurtboxObj] })
        .coro(function* (self) {
            while (true) {
                yield interp(bodyObj.controls, "exposedUnit").to(1).over(400);
                yield sleep(1000);
                yield interp(bodyObj.controls, "exposedUnit").to(0).over(700);
                yield sleep(1000);
                self.flipH(self.scale.x * -1);
            }
        })
        .step((self) => {
            self.status.state.isGuarding = bodyObj.controls.exposedUnit < 0.2;
        });
}

function objAngelSnailBody(theme: Theme) {
    const controls = {
        get exposedUnit() {
            return bodySprite.textureIndex / (bodySprite.textures.length - 1);
        },
        set exposedUnit(value) {
            bodySprite.textureIndex = value * (bodySprite.textures.length - 1);
        },
    };

    const bodySprite = objIndexedSprite(txBody);

    const eyesObj = theme.createEyesObj();
    const mouthObj = theme.createMouthObj().add(0, 8);

    return container(
        bodySprite,
        container(eyesObj, mouthObj)
            .step(self => self.visible = bodySprite.effectiveTextureIndex === bodySprite.textures.length - 1)
            .add(32, 15),
    )
        .merge({ controls, objects: { eyesObj, mouthObj } });
}
