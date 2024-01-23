class BooleanLocalStorageEntry {
    constructor(readonly key: string) { }

    get value() {
        return !!localStorage.getItem(this.key);
    }

    set value(value: boolean) {
        if (value)
            localStorage.setItem(this.key, "true");
        else
            localStorage.removeItem(this.key);
    }
}

export function createDebugKey(keycode: string, localStorageKey: string, onChange: (value: boolean, isKeyDownEvent: boolean) => void) {
    const entry = new BooleanLocalStorageEntry('debugKey_' + localStorageKey);

    onChange(entry.value, false);

    document.addEventListener("keydown", ({ code }) => {
        if (code !== keycode)
            return;

        entry.value = !entry.value;
        onChange(entry.value, true);
    });
}