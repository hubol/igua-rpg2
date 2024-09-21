import { EngineConfig } from "./engine-config";

let uniqueKeySource = 0;

export class SceneLocal<TValue> {
    constructor(
        private readonly _factory: () => TValue,
        private readonly _uniqueKey = `Anonymous@${uniqueKeySource++}`,
    ) {
    }

    get value(): TValue {
        const sceneStack = EngineConfig.sceneStack;
        const locals = sceneStack.locals;
        const value = locals[this._uniqueKey];
        if (value) {
            return value;
        }

        return locals[this._uniqueKey] = this._factory();
    }

    destroy() {
        const sceneStack = EngineConfig.sceneStack;
        const locals = sceneStack.locals;
        delete locals[this._uniqueKey];
    }
}
