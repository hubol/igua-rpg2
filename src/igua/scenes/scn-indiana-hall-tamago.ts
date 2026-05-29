import { DisplayObject, Graphics, Sprite } from "pixi.js";
import { Lvl, LvlType } from "../../assets/generated/levels/generated-level-data";
import { Sfx } from "../../assets/sounds";
import { Tx } from "../../assets/textures";
import { Sound } from "../../lib/game-engine/audio/sound";
import { Instances } from "../../lib/game-engine/instances";
import { factor } from "../../lib/game-engine/routines/interp";
import { onPrimitiveMutate } from "../../lib/game-engine/routines/on-primitive-mutate";
import { sleep } from "../../lib/game-engine/routines/sleep";
import { vdeg } from "../../lib/math/angle";
import { approachLinear, nlerp } from "../../lib/math/number";
import { Rng } from "../../lib/math/rng";
import { vnew } from "../../lib/math/vector-type";
import { Null } from "../../lib/types/null";
import { ZIndex } from "../core/scene/z-index";
import { DataPotion } from "../data/data-potion";
import { DramaHallOfDoors } from "../drama/drama-hall-of-doors";
import { DramaInventory } from "../drama/drama-inventory";
import { show } from "../drama/show";
import { Cutscene, scene } from "../globals";
import { mxnFxVibrate } from "../mixins/effects/mxn-fx-vibrate";
import { mxnCutscene } from "../mixins/mxn-cutscene";
import { mxnDestroyAfterSteps } from "../mixins/mxn-destroy-after-steps";
import { mxnEnemy } from "../mixins/mxn-enemy";
import { mxnEnemyDeathBurst } from "../mixins/mxn-enemy-death-burst";
import { mxnInteract } from "../mixins/mxn-interact";
import { mxnRpgAttack } from "../mixins/mxn-rpg-attack";
import { objItemRescueAngel } from "../objects/characters/obj-item-rescue-angel";
import { objFxFieryBurst170px } from "../objects/effects/obj-fx-fiery-burst-170px";
import { objFxRipple } from "../objects/effects/obj-fx-ripple";
import { objEsotericTamago } from "../objects/esoteric/obj-esoteric-tamago";
import { EsotericTamaButtons } from "../objects/esoteric/tamago/esoteric-tama-buttons";
import { EsotericTamaPage } from "../objects/esoteric/tamago/esoteric-tama-page";
import { Rpg } from "../rpg/rpg";
import { RpgAttack } from "../rpg/rpg-attack";
import { RpgEnemyRank } from "../rpg/rpg-enemy-rank";
import { RpgFaction } from "../rpg/rpg-faction";

export function scnIndianaHallTamago() {
    const lvl = Lvl.IndianaHallTamago();
    const cosmHallOfDoors = Rpg.microcosms["Indiana.HallOfDoors"];

    let uploadTransaction = Null<EsotericTamaPage.IO.UploadTransaction>();

    lvl.DepositBox
        .anchored(0.5, 0)
        .mixin(mxnCutscene, function* () {
            const item = yield* DramaInventory.askWhichAndRemoveOne(
                DataPotion.Ids.map(id => ({ kind: "potion", id })),
            );

            if (item === null) {
                return;
            }

            uploadTransaction!.uploadedItem = item;
            uploadTransaction = null;
        })
        .step(self => {
            self.interact.enabled = Boolean(uploadTransaction && !uploadTransaction.uploadedItem);
            self.anchor.y = approachLinear(self.anchor.y, self.interact.enabled ? 1 : 0, 0.03);
        });

    const io: EsotericTamaPage.IO = {
        beginUpload() {
            return uploadTransaction ??= { uploadedItem: null };
        },
        closeTransaction(transaction, action) {
            if (uploadTransaction === transaction) {
                uploadTransaction = null;
            }

            const item = transaction.uploadedItem;

            if (item && action !== "accepted") {
                Cutscene.play(function* () {
                    yield* DramaInventory.receiveItems([item]);
                    yield* show(
                        action === "canceled"
                            ? "Your item was refunded due to a race condition."
                            : "Your item was refunded. Only food and water are accepted.",
                    );
                });
            }
        },
        beginMinigame() {
            const session: EsotericTamaPage.IO.MinigameSession = {
                result: null,
            };
            scene.stage
                .coro(function* () {
                    yield* dramaStarMinigame({ lvl, aButtonObj, bButtonObj, session });
                });
            return session;
        },
        exit() {
            Cutscene.play(function* () {
                yield* DramaHallOfDoors.returnToHall(cosmHallOfDoors);
            });
        },
    };

    const buttons = new EsotericTamaButtons();
    const homePage = new EsotericTamaPage.Home(io, Rpg.microcosms["Indiana.MagicDoor.Tamago"]);

    const tamagoObj = objEsotericTamago(buttons, homePage)
        .at(lvl.TamagoShell)
        .zIndexed(ZIndex.BackgroundEntities)
        .show();

    const buttonIds: EsotericTamaButtons.Id[] = ["a", "b", "c"];

    const [aButtonObj, bButtonObj] = [lvl.ButtonA, lvl.ButtonB, lvl.ButtonC]
        .map((obj, i) => obj.mixin(mxnTamagoButton, buttons, buttonIds[i]));
}

const buttonSfx: Record<EsotericTamaButtons.Id, Sound> = {
    a: Sfx.Interact.Tamago.ButtonA,
    b: Sfx.Interact.Tamago.ButtonB,
    c: Sfx.Interact.Tamago.ButtonC,
};

function mxnTamagoButton(obj: DisplayObject, buttons: EsotericTamaButtons, id: EsotericTamaButtons.Id) {
    return obj
        .mixin(mxnFxVibrate, "pivot")
        .merge({ mxnTamagoButton: { pressesCount: 0 } })
        .coro(function* (self) {
            let vibrateStepsCount = 0;

            self
                .step(() => self.mxnFxVibrate.frequency = vibrateStepsCount-- > 0 ? 0.3 : 0)
                .mixin(mxnInteract, () => {
                    self.mxnTamagoButton.pressesCount++;
                    self.play(buttonSfx[id].rate(0.99, 1.01));

                    buttons.press(id);
                    vibrateStepsCount = 15;

                    objFxTamagotchiButtonRipple()
                        .at(obj)
                        .show();
                });
        });
}

type MxnTamagoButton = ReturnType<typeof mxnTamagoButton>;

function objFxTamagotchiButtonRipple() {
    return objFxRipple(
        {
            radius: 10,
            stroke: 5,
            tint: 0xffff00,
        },
        {
            radius: 30,
            stroke: 0,
            tint: 0x204A99,
        },
    )
        .mxnFxFactor.play(200, factor.sine);
}

interface DramaStarMinigameArgs {
    lvl: LvlType.IndianaHallTamago;
    aButtonObj: MxnTamagoButton;
    bButtonObj: MxnTamagoButton;
    session: EsotericTamaPage.IO.MinigameSession;
}

function* dramaStarMinigame(args: DramaStarMinigameArgs) {
    const { lvl } = args;
    const starObjs = [lvl.StarMarker0, lvl.StarMarker1, lvl.StarMarker2, lvl.StarMarker3]
        .map(obj =>
            Sprite.from(Tx.Esoteric.Tamago.GameStar)
                .mixin(objItemRescueAngel.mxnRescueStatus)
                .step(self => {
                    if (!self.collides(lvl.StarSafeRegion)) {
                        self.destroy();
                    }
                })
                .anchored(0.5, 0.5)
                .at(obj)
                .show()
        );
    const reticleObj = objReticle(args)
        .show();

    for (let f = 0; f < 1; f += 0.04 * 4) {
        const x = Rng.int(90, 410);

        for (const starObj of Rng.shuffle(starObjs.filter(obj => !obj.destroyed))) {
            const position = vnew(x + Rng.int(-70, 70), 280);

            objTamagoRescue(starObj)
                .at(position)
                .show();
            yield sleep(nlerp(1800, 800, f));
        }
    }

    yield () => Instances(objTamagoRescue).length === 0;

    const score = starObjs
        .filter(obj => !obj.mxnRescueStatus.isBeingRescued && !obj.destroyed)
        .length;
    args.session.result = { score };

    reticleObj.destroy();
    starObjs.forEach(obj => obj.mixin(mxnDestroyAfterSteps, 120));
}

function objReticle({ aButtonObj, bButtonObj }: DramaStarMinigameArgs) {
    let angle = 0;
    let angleDeltaSign = 1;

    return Sprite.from(Tx.Esoteric.Tamago.Reticle)
        .anchored(0.5, 0.5)
        .invisible()
        .step(self => {
            self.visible = true;
            const offset = vdeg(angle).scale(230, 120);
            self
                .at(250, 140)
                .add(offset.x, -Math.abs(offset.y))
                .vround();
            angle += angleDeltaSign * 2;
        })
        .coro(function* () {
            while (true) {
                yield onPrimitiveMutate(() => aButtonObj.mxnTamagoButton.pressesCount);
                angleDeltaSign *= -1;
            }
        })
        .coro(function* (self) {
            while (true) {
                yield onPrimitiveMutate(() => bButtonObj.mxnTamagoButton.pressesCount);
                objFxFieryBurst170px()
                    .mixin(mxnRpgAttack, { attack: atkBlast, damageTargetsOnce: true })
                    .at(self)
                    .show();
            }
        });
}

const rescueRank = RpgEnemyRank.create({
    status: {
        healthMax: 10,
        defenses: {
            physical: 50,
        },
        quirks: {
            emotionalDamageIsFatal: true,
        },
    },
});

const atkBlast = RpgAttack.create({
    emotional: 7,
    versus: RpgFaction.Enemy,
});

function objTamagoRescue(targetObj: DisplayObject) {
    const towSpeed = vnew(0, -1);
    const angelObj = objItemRescueAngel(targetObj, towSpeed, vnew());

    const hurtboxObj = new Graphics()
        .beginFill(0xff0000)
        .drawRect(25, 20, 40, 30)
        .invisible()
        .show(angelObj);

    return angelObj
        .mixin(mxnEnemy, { hurtboxes: [hurtboxObj], rank: rescueRank })
        .mixin(mxnEnemyDeathBurst, { map: [0x7A71E2, 0x6A45C6, 0x7A71E2] })
        .track(objTamagoRescue);
}
