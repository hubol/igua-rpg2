import { Graphics, Sprite } from "pixi.js";
import { Sfx } from "../../../assets/sounds";
import { Tx } from "../../../assets/textures";
import { interp } from "../../../lib/game-engine/routines/interp";
import { sleep } from "../../../lib/game-engine/routines/sleep";
import { approachLinear } from "../../../lib/math/number";
import { PolarInt } from "../../../lib/math/number-alias-types";
import { Rng } from "../../../lib/math/rng";
import { container } from "../../../lib/pixi/container";
import { ZIndex } from "../../core/scene/z-index";
import { mxnDetectPlayer } from "../../mixins/mxn-detect-player";
import { mxnEnemy } from "../../mixins/mxn-enemy";
import { mxnFacingPivot } from "../../mixins/mxn-facing-pivot";
import { mxnInteract } from "../../mixins/mxn-interact";
import { mxnRpgAttack } from "../../mixins/mxn-rpg-attack";
import { Rpg } from "../../rpg/rpg";
import { RpgAttack } from "../../rpg/rpg-attack";
import { RpgEnemyRank } from "../../rpg/rpg-enemy-rank";
import { RpgStatus } from "../../rpg/rpg-status";
import { objGroundSpawner } from "../obj-ground-spawner";
import { objProjectileFlameColumn } from "../projectiles/obj-projectile-flame-column";
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
    level0: RpgEnemyRank.create({
        status: {
            healthMax: 13,
        },
    }),
};

const atks = {
    flameColumn: RpgAttack.create({ physical: 50, versus: "opposing_faction" }),
};

export function objAngelPuller() {
    const theme = themes.common;
    const rank = ranks.level0;
    const armObj = objIndexedSprite([txArmLow, txArmMiddle, txArmHigh].reverse());

    const hurtboxObj = new Graphics()
        .beginFill(0xff0000)
        .drawRect(13, 8, 32, 46)
        .invisible();

    const mouthObj = theme.createMouthObj();
    return container(
        armObj,
        Sprite.from(txTorso),
        container(
            Sprite.from(txHead),
            container(
                theme.createEyesObj(),
                mouthObj
                    .coro(function* (self) {
                        self.controls.frowning = true;
                    })
                    .add(0, 5),
            )
                .add(29, 19)
                .mixin(mxnFacingPivot, { right: 8, left: -8, down: 2, up: -2 }),
        )
            .mixin(mxnFacingPivot, { right: 2, left: -2, down: 0, up: 0 }),
        hurtboxObj,
    )
        .mixin(mxnEnemy, { rank, hurtboxes: [hurtboxObj] })
        .mixin(mxnDetectPlayer)
        .coro(function* (self) {
            const leverObj = objAngelPuller.objLever()
                .at(self)
                .add(-39, -31)
                .show();

            self.handles("mxnEnemy.died", () => {
                const interactiveLeverObj = leverObj.mixin(mxnInteract, () => {
                    // TODO feels like this should be more convenient
                    interactiveLeverObj.interact.enabled = false;
                    interactiveLeverObj
                        .coro(function* () {
                            yield* interactiveLeverObj.objAngelPullerLever.coroPull(
                                Rpg.character.status,
                                atks.flameColumn,
                            );
                            interactiveLeverObj.interact.enabled = true;
                        });
                });
            });

            armObj
                .step(self => self.textureUnit = leverObj.objAngelPullerLever.handlePulledUnit);

            while (true) {
                yield () => self.mxnDetectPlayer.isDetected;
                yield* leverObj.objAngelPullerLever.coroPull(self.status, atks.flameColumn);
            }
        })
        .step(self => {
            mouthObj.controls.agapeUnit = approachLinear(
                mouthObj.controls.agapeUnit,
                self.mxnDetectPlayer.isDetected ? 1 : 0,
                0.1,
            );
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

    function* coroPull(attacker: RpgStatus.Model, attack: RpgAttack.Model) {
        handleObj.play(Sfx.Effect.PullerHandle);

        yield interp(api, "handlePulledUnit").steps(8).to(1).over(250);
        yield sleep(100);

        handleObj.play(Sfx.Effect.PullerFlameBurst.rate(0.9, 1.1));

        const flamesObjs = [
            objAngelPuller.objFlameColumnTrail(attacker, attack, 1)
                .at(obj.x + 80, obj.y + 28)
                .show(),
            objAngelPuller.objFlameColumnTrail(attacker, attack, -1)
                .at(obj.x - 20, obj.y + 28)
                .show(),
        ];

        yield () => flamesObjs.every(obj => obj.destroyed);

        yield interp(api, "handlePulledUnit").steps(8).to(0).over(660);
    }

    const handleObj = Sprite.from(txsLever[1])
        .step(self => self.y = Math.round(api.handlePulledUnit * 13));

    const obj = container(
        Sprite.from(txsLever[0]),
        handleObj,
    );
    return obj
        .merge({ objAngelPullerLever: api })
        .zIndexed(ZIndex.BackgroundEntities);
};

// TODO kinda copy-pastey from miffed...
objAngelPuller.objFlameColumnTrail = function objAngelPullerFlameColumnTrail (
    attacker: RpgStatus.Model,
    attack: RpgAttack.Model,
    signX: PolarInt,
) {
    const damageTargetsContext = mxnRpgAttack.createDamageTargetsContext();

    return objGroundSpawner({
        objFactory: (i) =>
            objProjectileFlameColumn()
                .mixin(mxnRpgAttack, { attack, attacker, damageTargetsOnce: true, damageTargetsContext })
                .coro(function* (self) {
                    self.play(Sfx.Effect.PullerFlameBurstTrail.rate(0.8 + i * 0.125 + Rng.float(0.1)));
                }),
        maxDistance: 150,
        speedX: 20 * signX,
    });
};
