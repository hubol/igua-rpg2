import { BooleanLocalStorageEntry } from "../../browser/boolean-local-storage-entry";

export function createDebugKey(
    keycode: string,
    localStorageKey: string,
    onChange: (value: boolean, isKeyDownEvent: boolean) => void,
) {
    const entry = new BooleanLocalStorageEntry("debugKey_" + localStorageKey);

    onChange(entry.value, false);

    document.addEventListener("keydown", ({ code }) => {
        if (code !== keycode) {
            return;
        }

        entry.value = !entry.value;
        onChange(entry.value, true);
    });
}
