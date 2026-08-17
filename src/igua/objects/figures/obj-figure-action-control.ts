import { Container, Sprite, Texture } from "pixi.js";
import { objText } from "../../../assets/fonts";
import { Tx } from "../../../assets/textures";
import { KeyCode } from "../../../lib/browser/key-listener";
import { GamepadControl } from "../../../lib/game-engine/input/gamepad-controls";
import { onMutate } from "../../../lib/game-engine/routines/on-mutate";
import { Integer } from "../../../lib/math/number-alias-types";
import { AsshatText } from "../../../lib/pixi/asshat-text";
import { container } from "../../../lib/pixi/container";
import { Action } from "../../core/input";
import { Input } from "../../globals";
import { StepOrder } from "../step-order";

export function objFigureInputActionControl(action: Action) {
    const rootObj = container<Container>();

    function updateGraph() {
        const control = Input.getControl(action);

        const figureControlObjs = new Array<Container>();

        if (typeof control === "string" || Array.isArray(control)) {
            figureControlObjs.push(...getFigureControlObjs(control));
        }
        else {
            figureControlObjs.push(...getFigureControlObjs(control.keyboard));
            figureControlObjs.push(...getFigureControlObjs(control.gamepad));
        }

        let x = 0;
        for (let i = 0; i < figureControlObjs.length; i++) {
            const obj = figureControlObjs[i];
            obj.x = x;

            obj.show(rootObj);

            if (i < figureControlObjs.length - 1) {
                x += obj.width + 2;
                Sprite.from(Tx.Ui.Controls.Slash).at(x, -3).show(rootObj);
                x += 6;
            }
        }
    }

    updateGraph();

    return rootObj
        .coro(function* (self) {
            while (true) {
                yield onMutate.Provider(() => Input.getControl(action));

                self.removeAllChildren();

                updateGraph();

                let container = self.parent;

                while (container) {
                    if (container instanceof AsshatText) {
                        container.dirty = true;
                        break;
                    }

                    container = container.parent;
                }
            }
        }, StepOrder.BeforeCamera);
}

function getFigureControlObjs(control: KeyCode | GamepadControl.Type[]): Container[] {
    if (typeof control === "string") {
        const figureData = keyCodeToFigureData[control] ?? control;

        if (figureData instanceof Texture) {
            return [Sprite.from(figureData).pivoted(0, 1)];
        }

        return [
            container(
                Sprite.from(Tx.Ui.Controls.KeyboardKey),
                objText.MediumBold(figureData, { tint: 0x3439BC })
                    .anchored(0.5, 0.5)
                    .at(9, 8),
            )
                .pivoted(0, 1),
        ];
    }

    const displayObjs = control.flatMap(gamepadControl => {
        if (gamepadControl.kind === "button") {
            return [
                Sprite.from(Tx.Ui.Controls[buttonIndexToTextureKey[gamepadControl.index]] ?? Texture.EMPTY)
                    .anchored(0, 0.5)
                    .at(0, 7),
            ];
        }

        return [];
    });

    return displayObjs;
}

const keyCodeToFigureData: Record<KeyCode, string | Texture> = {
    ArrowDown: Tx.Ui.Controls.KeyboardKeyDown,
    ArrowLeft: Tx.Ui.Controls.KeyboardKeyLeft,
    ArrowRight: Tx.Ui.Controls.KeyboardKeyRight,
    ArrowUp: Tx.Ui.Controls.KeyboardKeyUp,
    Backquote: "",
    Backslash: "",
    Backspace: "",
    BracketLeft: "",
    BracketRight: "",
    CapsLock: "",
    Comma: "",
    ControlLeft: "",
    ControlRight: "",
    Digit0: "0",
    Digit1: "1",
    Digit2: "2",
    Digit3: "3",
    Digit4: "4",
    Digit5: "5",
    Digit6: "6",
    Digit7: "7",
    Digit8: "8",
    Digit9: "9",
    End: "",
    Enter: "",
    Equal: "",
    Escape: "",
    Home: "",
    KeyA: "A",
    KeyB: "B",
    KeyC: "C",
    KeyD: "D",
    KeyE: "E",
    KeyF: "F",
    KeyG: "G",
    KeyH: "H",
    KeyI: "I",
    KeyJ: "J",
    KeyK: "K",
    KeyL: "L",
    KeyM: "M",
    KeyN: "N",
    KeyO: "O",
    KeyP: "P",
    KeyQ: "Q",
    KeyR: "R",
    KeyS: "S",
    KeyT: "T",
    KeyU: "U",
    KeyV: "V",
    KeyW: "W",
    KeyX: "X",
    KeyY: "Y",
    KeyZ: "Z",
    Minus: "",
    NumLock: "",
    Numpad0: "",
    Numpad1: "",
    Numpad2: "",
    Numpad3: "",
    Numpad4: "",
    Numpad5: "",
    Numpad6: "",
    Numpad7: "",
    Numpad8: "",
    Numpad9: "",
    NumpadAdd: "",
    NumpadDecimal: "",
    NumpadDivide: "",
    NumpadEnter: "",
    NumpadMultiply: "",
    NumpadSubtract: "",
    Period: "",
    Quote: "",
    Semicolon: "",
    ShiftLeft: "",
    ShiftRight: "",
    Slash: "",
    Space: Tx.Ui.Controls.KeyboardSpace,
    Tab: "",
};

const { StandardMapping: { Button } } = GamepadControl;

// TODO need d-pad icons
const buttonIndexToTextureKey: Record<Integer, keyof typeof Tx["Ui"]["Controls"]> = {
    [Button.Right]: "GamepadButtonB",
    [Button.Bottom]: "GamepadButtonA",
    [Button.Left]: "GamepadButtonX",
    [Button.Top]: "GamepadButtonY",
    [Button.BumperLeft]: "GamepadButtonLb",
    [Button.BumperRight]: "GamepadButtonRb",
    [Button.ControlLeft]: "GamepadControlLeft",
    [Button.ControlRight]: "GamepadControlRight",
};
