import { Graphics } from "pixi.js";
import { Sfx } from "../../../assets/sounds";
import { Tx } from "../../../assets/textures";
import { Coro } from "../../../lib/game-engine/routines/coro";
import { interpv } from "../../../lib/game-engine/routines/interp";
import { sleep } from "../../../lib/game-engine/routines/sleep";
import { Rng } from "../../../lib/math/rng";
import { vnew } from "../../../lib/math/vector-type";
import { container } from "../../../lib/pixi/container";
import { MapRgbFilter } from "../../../lib/pixi/filters/map-rgb-filter";
import { ZIndex } from "../../core/scene/z-index";
import { mxnDetectPlayer } from "../../mixins/mxn-detect-player";
import { mxnEnemy } from "../../mixins/mxn-enemy";
import { mxnEnemyDeathBurst } from "../../mixins/mxn-enemy-death-burst";
import { mxnFacingPivot } from "../../mixins/mxn-facing-pivot";
import { mxnPhysics } from "../../mixins/mxn-physics";
import { RpgEnemyRank } from "../../rpg/rpg-enemy-rank";
import { AngelThemeTemplate } from "./angel-theme-template";
import { objAngelMouth } from "./obj-angel-mouth";

const themes = (() => {
    const [
        txWings,
        txNoggin,
        txLegLeft,
        txLegRight,
        txTorso,
        txLeaf,
    ] = Tx.Enemy.Stupid.Layers.split({ width: 66 });

    const template = AngelThemeTemplate.create({
        sprites: {
            wings: txWings,
            noggin: txNoggin,
            legLeft: txLegLeft,
            legRight: txLegRight,
            torso: txTorso,
            leaf: txLeaf,
        },
        eyes: {
            defaultEyelidRestingPosition: 6,
            eyelidsTint: 0x1C6658,
            gap: 0,
            pupilRestStyle: {
                kind: "cross_eyed",
                offsetFromCenter: 0,
            },
            pupilsTint: 0x612185,
            pupilsTx: Tx.Enemy.Stupid.Pupil0,
            scleraTx: Tx.Enemy.Stupid.Sclera0,
            sclerasMirrored: true,
        },
        mouth: {
            txs: objAngelMouth.txs.rounded11,
            negativeSpaceTint: 0x612185,
            teethCount: 1,
            toothGapWidth: 0,
        },
        tints: {
            map: [0x22DA81, 0xFE3523, 0xFAE929] as MapRgbFilter.Map,
        },
    });

    return {
        common: template.createTheme(),
    };
})();

const ranks = {
    level0: RpgEnemyRank.create({
        loot: {
            tier0: [
                { kind: "potion", id: "CakeCombat" },
                { kind: "potion", id: "AnnoyIguanas" },
                { kind: "potion", id: "Ballon" },
            ],
        },
    }),
};

const variants = {
    level0: {
        theme: themes.common,
        rank: ranks.level0,
    },
};

export function objAngelStupid() {
    const { rank, theme } = variants.level0;

    const wingsObj = theme.createSprite("wings");

    wingsObj
        .pivotedUnit(0.5, 0.5)
        .at(wingsObj.pivot);

    const state = {
        flightPedometer: 0,
    };

    const hurtboxObj = new Graphics()
        .beginFill(0xff0000)
        .drawRect(14, 16, 38, 36)
        .invisible();

    const soulAnchorObj = new Graphics()
        .beginFill(0xff0000)
        .drawRect(33, 37, 1, 1)
        .invisible();

    const enemyObj = container(
        wingsObj,
        theme.createSprite("legLeft")
            .mixin(mxnFacingPivot, { left: 0, right: 3, down: 0, up: 0 }),
        theme.createSprite("legRight")
            .mixin(mxnFacingPivot, { left: -3, right: 0, down: 0, up: 0 }),
        theme.createSprite("torso"),
        theme.createSprite("noggin"),
        theme.createSprite("leaf")
            .mixin(mxnFacingPivot, { left: 2, right: -2, down: -1, up: 1 }),
        container(
            theme.createEyesObj()
                .at(33, 23),
            theme.createMouthObj()
                .at(33, 33),
        )
            .mixin(mxnFacingPivot, { left: -2, right: 2, down: 2, up: -2 }),
        hurtboxObj,
        soulAnchorObj,
    )
        .mixin(mxnDetectPlayer)
        .mixin(mxnPhysics, { gravity: 0.04, physicsRadius: 14, physicsOffset: [0, -14] })
        .mixin(mxnEnemy, { hurtboxes: [hurtboxObj], rank, soulAnchorObj })
        .mixin(mxnEnemyDeathBurst, { map: theme.tints.map })
        .handles("damaged", (self, event) => {
            if (event.impactSpeed) {
                self.speed.add(event.impactSpeed);
            }
        })
        .coro(function* (self) {
            while (true) {
                yield () => self.isOnGround;
                yield sleep(Rng.int(200, 1000));
                while (true) {
                    const target = vnew(Rng.intp(), -2);
                    const health = self.status.health;
                    yield* Coro.race([
                        () => self.status.health < health,
                        interpv(self.speed).to(target).over(Rng.int(333, 667)),
                    ]);
                    const max = Rng.float(0, 2);
                    yield () => self.isOnGround || self.speed.y >= max;
                    if (self.isOnGround) {
                        break;
                    }
                }
            }
        })
        .step(self => {
            if (self.isOnGround) {
                state.flightPedometer = 0;
                self.speed.x = 0;
            }
            else {
                state.flightPedometer += Math.abs(self.speed.y);
            }
        });

    wingsObj
        .step(self => {
            const phase = Math.floor(state.flightPedometer / 6) % 2;
            const previous = self.scale.x;
            self.scale.x = phase === 0 ? 1 : 0.9;
            if (previous !== self.scale.x && self.scale.x === 0.9) {
                self.play(Sfx.Enemy.Stupid.Flap.rate(1, 1.25));
            }
        });

    return enemyObj
        .pivoted(33, 53)
        .zIndexed(ZIndex.CharacterEntities);
}
