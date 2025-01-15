import { DisplayObject, Graphics, Sprite } from "pixi.js";
import { objText } from "../../assets/fonts";
import { container } from "../../lib/pixi/container";
import { renderer } from "../current-pixi-renderer";
import { Input, layers, scene } from "../globals";
import { Null } from "../../lib/types/null";
import { mxnSpeaker } from "../mixins/mxn-speaker";
import { Tx } from "../../assets/textures";
import { sleepf } from "../../lib/game-engine/routines/sleep";
import { holdf } from "../../lib/game-engine/routines/hold";
import { mxnBoilPivot } from "../mixins/mxn-boil-pivot";
import { SubjectiveColorAnalyzer } from "../../lib/color/subjective-color-analyzer";
import { Coro } from "../../lib/game-engine/routines/coro";
import { IndicesOf } from "../../lib/types/indices-of";
import { RgbInt } from "../../lib/math/number-alias-types";
import { objUiPage } from "../ui/framework/obj-ui-page";
import { vnew } from "../../lib/math/vector-type";
import { mxnBoilMirrorRotate } from "../mixins/mxn-boil-mirror-rotate";
import { CollisionShape } from "../../lib/pixi/collision";
import { fntErotix } from "../../assets/bitmap-fonts/fnt-erotix";
import { fntErotixLight } from "../../assets/bitmap-fonts/fnt-erotix-light";

const [txSpeakBox, txSpeakBoxOutline, txSpeakBoxTail] = Tx.Ui.Dialog.SpeakBox.split({ count: 3 });

function getMessageBoxColors(speaker: DisplayObject | null) {
    const primary = speaker?.is(mxnSpeaker) ? speaker.speaker.colorPrimary : 0x600000;
    const secondary = speaker?.is(mxnSpeaker) ? speaker.speaker.colorSecondary : 0x400000;
    const textPrimary = SubjectiveColorAnalyzer.getPreferredTextColor(primary);
    const textSecondary = SubjectiveColorAnalyzer.getPreferredTextColor(primary);

    return {
        primary,
        secondary,
        textPrimary,
        textSecondary,
    };
}

function objSpeakerMessageBox(speaker: DisplayObject | null) {
    const colors = getMessageBoxColors(speaker);
    const name = speaker?.is(mxnSpeaker) ? speaker.speaker.name : "???";

    const state = {
        speaker,
        isReadyToReceiveText: false,
        text: "",
        mayBeDestroyed: false,
    };

    return container().merge({ state }).coro(
        function* (self) {
            const spr = Sprite.from(txSpeakBoxOutline).tinted(colors.primary).show(
                container().mixin(mxnBoilPivot).show(self),
            );
            yield sleepf(4);
            spr.texture = txSpeakBox;
            yield sleepf(4);
            const nameTextObj = objText.MediumBoldIrregular(name, { tint: colors.textSecondary });
            const nameObj = container(
                new Graphics().beginFill(colors.secondary).drawRect(-4, -3, nameTextObj.width + 8, 13).mixin(
                    mxnBoilPivot,
                ),
                nameTextObj,
            ).at(37, 26).show(self);

            yield sleepf(4);
            state.isReadyToReceiveText = true;
            const textObj = objText.Medium("", {
                maxWidth: 224,
                tint: colors.textPrimary,
            }).step(textObj => textObj.text = state.text).at(
                28,
                41,
            ).show(self);

            yield holdf(() => state.mayBeDestroyed, 2);
            textObj.destroy();
            yield sleepf(4);
            nameObj.destroy();
            spr.texture = txSpeakBoxOutline;
            yield sleepf(4);
            self.destroy();
        },
    )
        .at(Math.round((renderer.width - txSpeakBox.width) / 2), -24)
        .show(layers.overlay.messages);
}

type ObjSpeakerMessageBox = ReturnType<typeof objSpeakerMessageBox>;
let instance = Null<ObjSpeakerMessageBox>();

function* showOneMessage(text: string) {
    const { currentSpeaker, currentInstance } = yield* startSpeaking(text);

    yield () => Input.isUp("Confirm");
    yield () => Input.isDown("Confirm");

    endSpeaking(currentSpeaker, currentInstance);
}

export const CtxShow = {
    speaker: Null<DisplayObject>(),
};

function endSpeaking(currentSpeaker: DisplayObject | null, currentInstance: ObjSpeakerMessageBox) {
    if (currentSpeaker?.is(mxnSpeaker)) {
        currentSpeaker.dispatch("mxnSpeaker.speakingEnded");
    }

    currentInstance.state.mayBeDestroyed = true;
    instance = currentInstance;
}

function* startSpeaking(text: string) {
    const currentSpeaker = CtxShow.speaker?.destroyed ? null : CtxShow.speaker;
    let currentInstance = instance?.destroyed ? null : instance;

    if (currentInstance) {
        if (currentInstance.state.speaker === currentSpeaker) {
            currentInstance.state.mayBeDestroyed = false;
        }
        else {
            currentInstance.state.mayBeDestroyed = true;
            yield () => currentInstance!.destroyed;
            currentInstance = null;
        }
    }

    if (!currentInstance) {
        currentInstance = objSpeakerMessageBox(currentSpeaker);
    }

    if (currentSpeaker?.is(mxnSpeaker)) {
        currentSpeaker.dispatch("mxnSpeaker.speakingStarted");
    }

    yield () => currentInstance!.state.isReadyToReceiveText;
    currentInstance.state.text = text;
    // TODO shitty names
    return { currentSpeaker, currentInstance };
}

export function* show(text: string, ...moreText: string[]) {
    for (const messageText of [text, ...moreText]) {
        yield* showOneMessage(messageText);
    }
}

const [txQuestionOptionBox, txQuestionOptionSelected] = Tx.Ui.Dialog.QuestionOption.split({ count: 2 });

function objQuestionOption(text: string, color: RgbInt, textColor: RgbInt) {
    const hitbox = new Graphics().beginFill(0xff0000).invisible().drawRect(6, 4, 112, 32);

    const obj = container(hitbox)
        .collisionShape(CollisionShape.DisplayObjects, [hitbox])
        .merge({ selected: false });

    container(
        container(
            Sprite.from(txQuestionOptionBox).tinted(color).anchored(0.5, 0.5).at(64, 23).step(self =>
                self.scale.set(obj.selected && Input.isDown("Confirm") ? -0.9 : 1, 1)
            ),
        ).mixin(mxnBoilPivot),
        objText.MediumIrregular(text, { tint: textColor, align: "center" }).anchored(0.5, 0.5).at(64, 22).step(self => {
            self.fontName = obj.selected ? fntErotix.font : fntErotixLight.font;
            if (obj.selected && scene.ticker.ticks % 7 === 0) {
                self.seed = (self.seed * 100_000) % 99_998;
            }
        }),
    )
        .step(self => self.pivot.y = obj.selected ? 2 : 0)
        .show(obj);

    return obj;
}

// TODO align name with messagebox
function objQuestionOptions(speaker: DisplayObject | null, options: string[]) {
    const colors = getMessageBoxColors(speaker);
    const state = { confirmedIndex: -1 };

    const pageObj = objUiPage(
        options.map((option, index) => {
            const position = vnew((index % 2) * 140, Math.floor(index / 2) * 45);
            if (index === options.length - 1 && options.length % 2 === 1) {
                position.x += 70;
            }
            return objQuestionOption(option, colors.secondary, colors.textSecondary).at(position);
        }),
        { selectionIndex: 0, startTicking: true },
    )
        .coro(function* (self) {
            yield () => self.selectionIndex >= 0 && Input.isDown("Confirm");
            yield () => Input.isUp("Confirm");
            // TODO assert self.selectionIndex >= 0
            state.confirmedIndex = self.selectionIndex;
        });

    const offset = vnew(64, 20);
    const v = vnew();

    return container(
        pageObj,
        Sprite.from(txQuestionOptionSelected).at(offset).anchored(0.5, 0.5).mixin(mxnBoilMirrorRotate).tinted(0x000000)
            .step(
                self => {
                    if (!pageObj.selected) {
                        return;
                    }
                    self.scale.set(Input.isDown("Confirm") ? 0.9 : 1);
                    self.moveTowards(v.at(offset).add(pageObj.selected), 8);
                },
            ),
    ).at(117, 66).merge({ state }).show(layers.overlay.messages);
}

export function ask(question: string): Coro.Type<boolean>;
export function ask<TOptions extends string[]>(question: string, ...options: TOptions): Coro.Type<IndicesOf<TOptions>>;
export function* ask(question: string, ...options: string[]): Coro.Type<any> {
    const isYesNo = options.length === 0;

    if (isYesNo) {
        options = ["Yes", "No"];
    }

    const { currentSpeaker, currentInstance } = yield* startSpeaking(question);

    const optionsObj = objQuestionOptions(currentSpeaker, options);
    yield () => optionsObj.state.confirmedIndex >= 0;

    optionsObj.destroy(); // TODO cute animation

    endSpeaking(currentSpeaker, currentInstance);

    if (isYesNo) {
        return optionsObj.state.confirmedIndex === 0;
    }

    return optionsObj.state.confirmedIndex;
}
