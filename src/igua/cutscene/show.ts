import { DisplayObject, Graphics, Sprite } from "pixi.js";
import { objText } from "../../assets/fonts";
import { container } from "../../lib/pixi/container";
import { renderer } from "../current-pixi-renderer";
import { Cutscene, Input, layers, scene } from "../globals";
import { Null } from "../../lib/types/null";
import { mxnSpeaker } from "../mixins/mxn-speaker";
import { Tx } from "../../assets/textures";
import { sleep, sleepf } from "../../lib/game-engine/routines/sleep";
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
import { interpvr } from "../../lib/game-engine/routines/interp";
import { isNotNullish } from "../../lib/types/guards/is-not-nullish";

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
            const rootObj = container().at(Math.round((renderer.width - txSpeakBox.width) / 2), -24).show(self);
            const spr = Sprite.from(txSpeakBoxOutline).tinted(colors.primary).show(
                container().mixin(mxnBoilPivot).show(rootObj),
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
            ).at(37, 26).show(rootObj);

            yield sleepf(4);
            state.isReadyToReceiveText = true;
            const textObj = objText.Medium("", {
                maxWidth: 224,
                tint: colors.textPrimary,
            }).step(textObj => textObj.text = state.text).at(
                28,
                41,
            ).show(rootObj);

            yield holdf(() => state.mayBeDestroyed, 2);
            textObj.destroy();
            yield sleepf(4);
            nameObj.destroy();
            spr.texture = txSpeakBoxOutline;
            yield sleepf(4);
            self.destroy();
        },
    )
        .show(layers.overlay.messages);
}

type ObjSpeakerMessageBox = ReturnType<typeof objSpeakerMessageBox>;
let speakerMessageBoxObj = Null<ObjSpeakerMessageBox>();

function* showOneMessage(text: string) {
    const { currentSpeaker, currentSpeakerMessageBoxObj } = yield* startSpeaking(text);

    yield () => Input.isUp("Confirm");
    yield () => Input.isDown("Confirm");

    endSpeaking(currentSpeaker, currentSpeakerMessageBoxObj);
}

function endSpeaking(currentSpeaker: DisplayObject | null, currentSpeakerMessageBoxObj: ObjSpeakerMessageBox) {
    if (currentSpeaker?.is(mxnSpeaker)) {
        currentSpeaker.dispatch("mxnSpeaker.speakingEnded");
    }

    currentSpeakerMessageBoxObj.state.mayBeDestroyed = true;
    speakerMessageBoxObj = currentSpeakerMessageBoxObj;
}

function* startSpeaking(text: string) {
    const currentSpeaker = Cutscene.current?.attributes?.speaker?.destroyed
        ? null
        : (Cutscene.current?.attributes.speaker ?? null);
    let currentSpeakerMessageBoxObj = speakerMessageBoxObj?.destroyed ? null : speakerMessageBoxObj;

    if (currentSpeakerMessageBoxObj) {
        if (currentSpeakerMessageBoxObj.state.speaker === currentSpeaker) {
            currentSpeakerMessageBoxObj.state.mayBeDestroyed = false;
        }
        else {
            currentSpeakerMessageBoxObj.state.mayBeDestroyed = true;
            yield () => currentSpeakerMessageBoxObj!.destroyed;
            currentSpeakerMessageBoxObj = null;
        }
    }

    if (!currentSpeakerMessageBoxObj) {
        currentSpeakerMessageBoxObj = objSpeakerMessageBox(currentSpeaker);
    }

    if (currentSpeaker?.is(mxnSpeaker)) {
        currentSpeaker.dispatch("mxnSpeaker.speakingStarted");
    }

    yield () => currentSpeakerMessageBoxObj!.state.isReadyToReceiveText;
    currentSpeakerMessageBoxObj.state.text = text;
    return { currentSpeaker, currentSpeakerMessageBoxObj };
}

export function* show(text: string, ...moreText: string[]) {
    for (const messageText of [text, ...moreText]) {
        yield* showOneMessage(messageText);
    }
}

/** Clear any messages on the screen.
 * Note: `show` and `ask` Coros may not complete. Use `clear` only when you know this is safe.
 */
export function clear() {
    if (speakerMessageBoxObj) {
        speakerMessageBoxObj.state.mayBeDestroyed = true;
    }
}

const [txQuestionOptionBox, txQuestionOptionSelected] = Tx.Ui.Dialog.QuestionOption.split({ count: 2 });

function objQuestionOptionBox(text: string, color: RgbInt, textColor: RgbInt) {
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

function objQuestionOptionBoxes(speaker: DisplayObject | null, options: AskOptions) {
    const colors = getMessageBoxColors(speaker);
    const state = { confirmedIndex: -1 };

    let layoutIndex = 0;
    const optionObjs = options.map((option, index) => {
        if (option === null) {
            return null;
        }
        const position = vnew((layoutIndex % 2) * 140, Math.floor(layoutIndex / 2) * 45);
        if (index === options.length - 1 && layoutIndex % 2 === 0) {
            position.x += 70;
        }

        const obj = objQuestionOptionBox(option, colors.secondary, colors.textSecondary)
            .merge({ index, layoutIndex })
            .at(position);

        layoutIndex++;

        return obj;
    })
        .filter(isNotNullish);

    type ObjQuestionOptionBox = typeof optionObjs[number];

    const pageObj = objUiPage(
        optionObjs,
        { selectionIndex: 0, startTicking: true },
    )
        .coro(function* (self) {
            yield () => Boolean(self.selected) && Input.isDown("Confirm");
            yield () => Input.isUp("Confirm");

            self.navigation = false;
            const selectedOptionObj = self.selected as ObjQuestionOptionBox;

            const translateX = selectedOptionObj.layoutIndex % 2 === 0 ? renderer.width : -renderer.width;
            yield* Coro.all(
                optionObjs.map((optionObj) =>
                    selectedOptionObj === optionObj
                        ? Coro.chain([
                            sleep(250),
                            interpvr(optionObj).translate(0, -renderer.height).over(500),
                        ])
                        : interpvr(optionObj).translate(translateX, 0).over(500)
                ),
            );

            state.confirmedIndex = selectedOptionObj.index;
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
                    self.scale.set(pageObj.navigation && Input.isDown("Confirm") ? 0.9 : 1);
                    self.moveTowards(v.at(offset).add(pageObj.selected), 8);
                },
            ),
    ).at(117, 66).merge({ state });
}

type AskOptions = Array<string | null>;

export function ask(question: string): Coro.Type<boolean>;
export function ask<TOptions extends AskOptions>(
    question: string,
    ...options: TOptions
): Coro.Type<IndicesOf<TOptions>>;
export function* ask(question: string, ...options: AskOptions): Coro.Type<any> {
    const isYesNo = options.length === 0;

    if (isYesNo) {
        options = ["Yes", "No"];
    }

    // TODO assert that at least one option is not null!

    const { currentSpeaker, currentSpeakerMessageBoxObj } = yield* startSpeaking(question);

    yield () => Input.isUp("Confirm");

    const optionsObj = objQuestionOptionBoxes(currentSpeaker, options).show(currentSpeakerMessageBoxObj);
    yield () => optionsObj.state.confirmedIndex >= 0;

    optionsObj.destroy();

    endSpeaking(currentSpeaker, currentSpeakerMessageBoxObj);

    if (isYesNo) {
        return optionsObj.state.confirmedIndex === 0;
    }

    return optionsObj.state.confirmedIndex;
}
