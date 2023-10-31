const KeyCodes = [ "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowUp",
    "Backquote", "Backslash", "Backspace", "BracketLeft", "BracketRight",
    "CapsLock", "Comma", "ControlLeft", "ControlRight",
    "Digit0", "Digit1", "Digit2", "Digit3", "Digit4", "Digit5", "Digit6", "Digit7", "Digit8", "Digit9",
    "End", "Enter", "Equal", "Escape", "Home",
    "KeyA", "KeyB", "KeyC", "KeyD", "KeyE", "KeyF", "KeyG", "KeyH", "KeyI", "KeyJ", "KeyK", "KeyL", "KeyM", "KeyN",
    "KeyO", "KeyP", "KeyQ", "KeyR", "KeyS", "KeyT", "KeyU", "KeyV", "KeyW", "KeyX", "KeyY", "KeyZ",
    "Minus", "NumLock",
    "Numpad0", "Numpad1", "Numpad2", "Numpad3", "Numpad4", "Numpad5", "Numpad6", "Numpad7", "Numpad8", "Numpad9",
    "NumpadAdd", "NumpadDecimal", "NumpadDivide", "NumpadEnter", "NumpadMultiply", "NumpadSubtract",
    "Period", "Quote", "Semicolon",
    "ShiftLeft", "ShiftRight",
    "Slash", "Space",
    "Tab"
] as const;

export type KeyCode = typeof KeyCodes[number];

type KeysState = Partial<Record<KeyCode, boolean>>;

export const Key = {
    isDown(key: KeyCode) {
        return key in currentKeysState && currentKeysState[key];
    },
    isUp(key: KeyCode) {
        return !this.isDown(key);
    },
    justWentDown(key: KeyCode) {
        return previouslyUp(key) && this.isDown(key);
    },
    justWentUp(key: KeyCode) {
        return previouslyDown(key) && this.isUp(key);
    }
};

function previouslyDown(key: KeyCode) {
    return key in previousKeysState && previousKeysState[key];
}

function previouslyUp(key: KeyCode) {
    return !previouslyDown(key);
}

let previousKeysState: KeysState = {};
let currentKeysState: KeysState = {};
const workingKeysState: KeysState = {};

function handleKeyDown(event: KeyboardEvent) {
    workingKeysState[event.code] = true;
}

function handleKeyUp(event: KeyboardEvent) {
    workingKeysState[event.code] = false;
}

let startedKeyListener = false;

export const KeyListener = {
    start() {
        if (startedKeyListener)
            throw new Error("Cannot start key listener twice!");
        document.addEventListener("keydown", handleKeyDown);
        document.addEventListener("keypress", handleKeyDown);
        document.addEventListener("keyup", handleKeyUp);
        startedKeyListener = true;
    },
    advance() {
        if (!startedKeyListener)
            throw new Error("Key listener must be started to advance!");
        const p = previousKeysState;
        for (const key in p)
            delete p[key];
    
        previousKeysState = currentKeysState;
        currentKeysState = Object.assign(p, workingKeysState);
    }
}
