import { PixiRenderer } from "../lib/game-engine/pixi-renderer";
import { IguaLayers } from "./core/igua-layers";
import { IguaScene, IguaSceneStack } from "./core/scene/igua-scene-stack";
import { IguaInput } from "./core/input";
import { Container } from "pixi.js";
import { IguaCutscene } from "./core/igua-cutscene";
import { KeyListener } from "../lib/browser/key-listener";

export let renderer: PixiRenderer;
export let layers: IguaLayers;
export let scene: IguaScene;
export let sceneStack: IguaSceneStack;
export let Input: Pick<IguaInput, "isDown" | "isUp" | "justWentDown" | "justWentUp">;
export let Cutscene: IguaCutscene;
export let forceGameLoop: () => void;
export let startAnimator: () => void;
export let DevKey: KeyListener;

export function setIguaGlobals(
    pixiRenderer: PixiRenderer,
    rootStage: Container,
    iguaInput: IguaInput,
    forceGameLoopFn: () => void,
    startAnimatorFn: () => void,
    devKey: KeyListener,
) {
    renderer = pixiRenderer;
    layers = new IguaLayers(rootStage);
    sceneStack = new IguaSceneStack(layers, (_scene) => scene = _scene);
    Input = iguaInput;
    Cutscene = new IguaCutscene(rootStage);
    forceGameLoop = forceGameLoopFn;
    startAnimator = startAnimatorFn;
    DevKey = devKey;
}
