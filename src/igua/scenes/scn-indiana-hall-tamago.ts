import { DisplayObject } from "pixi.js";
import { Lvl } from "../../assets/generated/levels/generated-level-data";
import { Sfx } from "../../assets/sounds";
import { Sound } from "../../lib/game-engine/audio/sound";
import { factor } from "../../lib/game-engine/routines/interp";
import { approachLinear } from "../../lib/math/number";
import { Null } from "../../lib/types/null";
import { ZIndex } from "../core/scene/z-index";
import { DataPotion } from "../data/data-potion";
import { DramaHallOfDoors } from "../drama/drama-hall-of-doors";
import { DramaInventory } from "../drama/drama-inventory";
import { show } from "../drama/show";
import { Cutscene } from "../globals";
import { mxnFxVibrate } from "../mixins/effects/mxn-fx-vibrate";
import { mxnCutscene } from "../mixins/mxn-cutscene";
import { mxnInteract } from "../mixins/mxn-interact";
import { objFxRipple } from "../objects/effects/obj-fx-ripple";
import { objEsotericTamago } from "../objects/esoteric/obj-esoteric-tamago";
import { EsotericTamaButtons } from "../objects/esoteric/tamago/esoteric-tama-buttons";
import { EsotericTamaPage } from "../objects/esoteric/tamago/esoteric-tama-page";
import { Rpg } from "../rpg/rpg";

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
        exit() {
            Cutscene.play(function* () {
                yield* DramaHallOfDoors.returnToHall(cosmHallOfDoors);
            });
        },
    };

    const buttons = new EsotericTamaButtons();
    const homePage = new EsotericTamaPage.Home(io);

    const tamagoObj = objEsotericTamago(buttons, homePage)
        .at(lvl.TamagoShell)
        .zIndexed(ZIndex.BackgroundEntities)
        .show();

    const buttonIds: EsotericTamaButtons.Id[] = ["a", "b", "c"];

    [lvl.ButtonA, lvl.ButtonB, lvl.ButtonC]
        .forEach((obj, i) => obj.mixin(mxnTamagoButton, buttons, buttonIds[i]));
}

const buttonSfx: Record<EsotericTamaButtons.Id, Sound> = {
    a: Sfx.Interact.Tamago.ButtonA,
    b: Sfx.Interact.Tamago.ButtonB,
    c: Sfx.Interact.Tamago.ButtonC,
};

function mxnTamagoButton(obj: DisplayObject, buttons: EsotericTamaButtons, id: EsotericTamaButtons.Id) {
    return obj
        .mixin(mxnFxVibrate, "pivot")
        .coro(function* (self) {
            let vibrateStepsCount = 0;

            self
                .step(() => self.mxnFxVibrate.frequency = vibrateStepsCount-- > 0 ? 0.3 : 0)
                .mixin(mxnInteract, () => {
                    self.play(buttonSfx[id].rate(0.99, 1.01));

                    buttons.press(id);
                    vibrateStepsCount = 15;

                    objFxTamagotchiButtonRipple()
                        .at(obj)
                        .show();
                });
        });
}

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
