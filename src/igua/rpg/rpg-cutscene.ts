import { Logger } from "../../lib/game-engine/logger";
import { Cutscene } from "../globals";

class Local<T> {
    private readonly _map = new WeakMap<object, T>();

    constructor(private readonly _initFn: () => T) {
    }

    get value(): T {
        const currentCutscene = Cutscene.current;

        if (!currentCutscene) {
            Logger.logContractViolationError(
                "RpgCutscene.Storage",
                new Error("attempting to access value while Cutscene.current is falsy!"),
            );
            return this._initFn();
        }

        const value = this._map.get(currentCutscene);

        if (value === undefined) {
            const newValue = this._initFn();
            this._map.set(currentCutscene, newValue);
            return newValue;
        }

        return value;
    }
}

export const RpgCutscene = {
    Local,
    get isPlaying() {
        return Cutscene.isPlaying;
    },
};
