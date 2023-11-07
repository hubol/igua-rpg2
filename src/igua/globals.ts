import { GameEngine } from "../lib/game-engine/game-engine";
import { IguaScene, IguaSceneStack } from "./igua-scene-stack";

export let engine: GameEngine;

export let scene: IguaScene;
export const sceneStack = new IguaSceneStack((_scene) => scene = _scene);

export function installGlobals(_engine: GameEngine) {
    engine = _engine;
}
