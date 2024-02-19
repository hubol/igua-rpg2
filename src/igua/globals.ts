import { PixiRenderer } from "../lib/game-engine/pixi-renderer";
import { IguaLayers } from "./core/igua-layers";
import { IguaScene, IguaSceneStack } from "./core/scene/igua-scene-stack";
import { IguaInput } from "./core/input";
import { Container } from "pixi.js";

export let renderer: PixiRenderer;
export let layers: IguaLayers;
export let scene: IguaScene;
export let sceneStack: IguaSceneStack;
export let Input: Pick<IguaInput, 'isDown' | 'isUp' | 'justWentDown' | 'justWentUp'>;
export let forceGameLoop: () => void;

export function setIguaGlobals(pixiRenderer: PixiRenderer, rootStage: Container, iguaInput: IguaInput, forceGameLoopFn: () => void) {
    renderer = pixiRenderer;
    layers = new IguaLayers(rootStage);
    sceneStack = new IguaSceneStack(layers, (_scene) => scene = _scene);
    Input = iguaInput;
    forceGameLoop = forceGameLoopFn;
}