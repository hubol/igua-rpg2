import { scene } from "../globals";
import { IguaScene } from "../igua-scene-stack";

let idSource = 0;

export class SceneLocal<T> {
    constructor(private readonly _factory: (scene: IguaScene) => T, private readonly _sceneUniqueKey = `Anonymous@${idSource++}`) { }

    get value(): T {
        const value = scene.locals[this._sceneUniqueKey];
        if (value)
            return value;

        return scene.locals[this._sceneUniqueKey] = this._factory(scene);
    }
}