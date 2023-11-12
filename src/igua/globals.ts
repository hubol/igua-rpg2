import { Container } from "pixi.js";
import { KeyListener } from "../lib/browser/key";
import { Animator } from "../lib/game-engine/animator";
import { AsshatTicker } from "../lib/game-engine/asshat-ticker";
import { AsshatZoneDiagnostics } from "../lib/game-engine/asshat-zone";
import { PixiRenderer } from "../lib/game-engine/pixi-renderer";
import { IguaLayers } from "./igua-layers";
import { IguaScene, IguaSceneStack } from "./igua-scene-stack";

export let renderer: PixiRenderer;

const rootStage = new Container();
const layers = new IguaLayers(rootStage);

export let scene: IguaScene;
export const sceneStack = new IguaSceneStack(layers, (_scene) => scene = _scene);

export function installGlobals(_renderer: PixiRenderer) {
    renderer = _renderer;

    const ticker = new AsshatTicker();

    KeyListener.start();

    ticker.add(() => {
        AsshatZoneDiagnostics.printHandledCancellationErrors();
        KeyListener.advance();
        scene?.ticker.update();
    });

    const animator = new Animator(60);
    animator.start();

    animator.add(() => {
        ticker.update();
        renderer.render(rootStage);
    });
}
