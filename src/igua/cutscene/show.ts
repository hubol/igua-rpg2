import { DisplayObject, Graphics, Sprite } from "pixi.js";
import { objText } from "../../assets/fonts";
import { container } from "../../lib/pixi/container";
import { renderer } from "../current-pixi-renderer";
import { Input, layers } from "../globals";
import { Null } from "../../lib/types/null";
import { mxnSpeaker } from "../mixins/mxn-speaker";
import { Tx } from "../../assets/textures";
import { sleepf } from "../../lib/game-engine/routines/sleep";
import { holdf } from "../../lib/game-engine/routines/hold";
import { mxnBoilPivot } from "../mixins/mxn-boil-pivot";

const [txSpeakBox, txSpeakBoxOutline, txSpeakBoxTail] = Tx.Ui.Dialog.SpeakBox.split({ count: 3 });

function objSpeakerMessageBox(speaker: DisplayObject | null) {
    const colorPrimary = speaker?.is(mxnSpeaker) ? speaker.speaker.colorPrimary : 0x600000;
    const colorSecondary = speaker?.is(mxnSpeaker) ? speaker.speaker.colorSecondary : 0x400000;
    const name = speaker?.is(mxnSpeaker) ? speaker.speaker.name : "???";

    const state = {
        speaker,
        isReadyToReceiveText: false,
        text: "",
        mayBeDestroyed: false,
    };

    return container().merge({ state }).coro(
        function* (self) {
            const spr = Sprite.from(txSpeakBoxOutline).tinted(colorPrimary).show(
                container().mixin(mxnBoilPivot).show(self),
            );
            yield sleepf(4);
            spr.texture = txSpeakBox;
            yield sleepf(4);
            const nameTextObj = objText.MediumBoldIrregular(name);
            const nameObj = container(
                new Graphics().beginFill(colorSecondary).drawRect(-4, -3, nameTextObj.width + 8, 13).mixin(
                    mxnBoilPivot,
                ),
                nameTextObj,
            ).at(37, 26).show(self);

            yield sleepf(4);
            state.isReadyToReceiveText = true;
            const textObj = objText.Medium("", { maxWidth: 224 }).step(textObj => textObj.text = state.text).at(
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
        .at(Math.round((renderer.width - txSpeakBox.width) / 2), -31)
        .show(layers.overlay.messages);
}

let instance = Null<ReturnType<typeof objSpeakerMessageBox>>();

function* showOneMessage(text: string) {
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

    yield () => currentInstance!.state.isReadyToReceiveText;
    currentInstance.state.text = text;

    yield () => Input.isUp("Confirm");
    yield () => Input.isDown("Confirm");

    currentInstance.state.mayBeDestroyed = true;
    instance = currentInstance;
}

export const CtxShow = {
    speaker: Null<DisplayObject>(),
};

export function* show(text: string, ...moreText: string[]) {
    for (const messageText of [text, ...moreText]) {
        yield* showOneMessage(messageText);
    }
}
