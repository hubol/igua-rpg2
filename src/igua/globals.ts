import { Container } from "pixi.js";
import { KeyListener } from "../lib/browser/key-listener";
import { IguaCutscene } from "./core/igua-cutscene";
import { IguaLayers } from "./core/igua-layers";
import { IguaInput } from "./core/input";
import { IguaScene, IguaSceneStack } from "./core/scene/igua-scene-stack";

export let layers: IguaLayers;
export let scene: IguaScene;
export let sceneStack: IguaSceneStack;
export let Input: Pick<IguaInput, "isDown" | "isUp" | "justWentDown" | "justWentUp">;
export let Cutscene: IguaCutscene;
export let forceGameLoop: () => void;
export let startAnimator: () => void;
export let DevKey: KeyListener;

export function setIguaGlobals(
    rootStage: Container,
    iguaInput: IguaInput,
    forceGameLoopFn: () => void,
    startAnimatorFn: () => void,
    devKey: KeyListener,
) {
    layers = new IguaLayers(rootStage);
    sceneStack = new IguaSceneStack(layers, (_scene) => scene = _scene);
    Input = iguaInput;
    Cutscene = new IguaCutscene(rootStage);
    forceGameLoop = forceGameLoopFn;
    startAnimator = startAnimatorFn;
    DevKey = devKey;
}
