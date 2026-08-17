import { Sprite } from "pixi.js";
import { objText } from "../../../assets/fonts";
import { Tx } from "../../../assets/textures";
import { KeyCode } from "../../../lib/browser/key-listener";
import { onMutate } from "../../../lib/game-engine/routines/on-mutate";
import { AsshatText } from "../../../lib/pixi/asshat-text";
import { container } from "../../../lib/pixi/container";
import { Action } from "../../core/input";
import { Input } from "../../globals";

export function objFigureInputActionControl(action: Action) {
    const control = Input.getControl(action);

    return container(objFigureControl(control))
        .coro(function* (self) {
            while (true) {
                yield onMutate.Provider(() => Input.getControl(action));
                self.removeAllChildren();
                objFigureControl(Input.getControl(action)).show(self);

                let container = self.parent;

                while (container) {
                    if (container instanceof AsshatText) {
                        container.dirty = true;
                        break;
                    }

                    container = container.parent;
                }
            }
        });
}

function objFigureControl(control: ReturnType<typeof Input["getControl"]>) {
    if (typeof control === "string") {
        return container(
            Sprite.from(Tx.Ui.Controls.KeyboardKey),
            objText.MediumBold(keyCodeToFigureData[control] ?? control, { tint: 0x3439BC })
                .anchored(0.5, 0.5)
                .at(9, 8),
        )
            .pivoted(0, 2);
    }

    return container();
}

const keyCodeToFigureData: Record<KeyCode, string> = {
    ArrowDown: "",
    ArrowLeft: "",
    ArrowRight: "",
    ArrowUp: "",
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
    Space: "",
    Tab: "",
};
