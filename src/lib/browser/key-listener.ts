const KeyCodes = [
    "ArrowDown",
    "ArrowLeft",
    "ArrowRight",
    "ArrowUp",
    "Backquote",
    "Backslash",
    "Backspace",
    "BracketLeft",
    "BracketRight",
    "CapsLock",
    "Comma",
    "ControlLeft",
    "ControlRight",
    "Digit0",
    "Digit1",
    "Digit2",
    "Digit3",
    "Digit4",
    "Digit5",
    "Digit6",
    "Digit7",
    "Digit8",
    "Digit9",
    "End",
    "Enter",
    "Equal",
    "Escape",
    "Home",
    "KeyA",
    "KeyB",
    "KeyC",
    "KeyD",
    "KeyE",
    "KeyF",
    "KeyG",
    "KeyH",
    "KeyI",
    "KeyJ",
    "KeyK",
    "KeyL",
    "KeyM",
    "KeyN",
    "KeyO",
    "KeyP",
    "KeyQ",
    "KeyR",
    "KeyS",
    "KeyT",
    "KeyU",
    "KeyV",
    "KeyW",
    "KeyX",
    "KeyY",
    "KeyZ",
    "Minus",
    "NumLock",
    "Numpad0",
    "Numpad1",
    "Numpad2",
    "Numpad3",
    "Numpad4",
    "Numpad5",
    "Numpad6",
    "Numpad7",
    "Numpad8",
    "Numpad9",
    "NumpadAdd",
    "NumpadDecimal",
    "NumpadDivide",
    "NumpadEnter",
    "NumpadMultiply",
    "NumpadSubtract",
    "Period",
    "Quote",
    "Semicolon",
    "ShiftLeft",
    "ShiftRight",
    "Slash",
    "Space",
    "Tab",
] as const;

export type KeyCode = typeof KeyCodes[number];

type KeysState = Partial<Record<KeyCode, number>>;

export class KeyListener {
    private _started = false;
    private readonly _state: KeysState = {};

    isDown(key: KeyCode) {
        return (this._state[key]! & 0b101) as unknown as boolean;
    }

    isUp(key: KeyCode) {
        return !this.isDown(key);
    }

    justWentDown(key: KeyCode) {
        return (this._state[key]! & 0b100) as unknown as boolean;
    }

    justWentUp(key: KeyCode) {
        return (this._state[key]! & 0b010) as unknown as boolean;
    }

    protected onKeyDown(event: KeyboardEvent) {
        // First repeat KeyboardEvent when pressing arrow keys does not have .repeat set to true
        // Can check held bit to discard this event
        if (event.repeat || this._state[event.code] & 0b001) {
            return;
        }
        this._state[event.code] |= 0b101;
    }

    protected onKeyUp(event: KeyboardEvent) {
        this._state[event.code] |= 0b010;
        this._state[event.code] &= 0b110;
    }

    start() {
        if (this._started) {
            return console.error("Attempting to start KeyListener twice!", this);
        }
        document.addEventListener("keydown", this.onKeyDown.bind(this));
        document.addEventListener("keyup", this.onKeyUp.bind(this));
        this._started = true;
    }

    tick() {
        if (!this._started) {
            return console.error("Attempting to tick() unstarted KeyListener", this);
        }
        for (const key in this._state) {
            this._state[key] &= 0b001;
        }
    }
}
