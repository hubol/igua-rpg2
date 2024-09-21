import { LocalStorageEntry } from "../../browser/local-storage-entry";
import { AdjustColor } from "../../pixi/adjust-color";

const debugColorsLocalStorage = new LocalStorageEntry<string[]>("debugColors");
let debugColors: string[] = [];

export const DebugColors = {
    get() {
        const value = debugColorsLocalStorage.value;
        if (value) {
            debugColors = value;
        }
        return debugColors;
    },
    getPixi() {
        return this.get().filter(x => !!x).map(x => AdjustColor.hex(x).toPixi());
    },
    update(index: number, value: string) {
        debugColors[index] = value;
        debugColorsLocalStorage.value = debugColors;
    },
};
