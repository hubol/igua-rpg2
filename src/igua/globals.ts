import { Container, Rectangle } from "pixi.js";
import { KeyListener } from "../lib/browser/key";
import { Animator } from "../lib/game-engine/animator";
import { AsshatTicker } from "../lib/game-engine/asshat-ticker";
import { AsshatZoneDiagnostics } from "../lib/game-engine/asshat-zone";
import { PixiRenderer } from "../lib/game-engine/pixi-renderer";
import { IguaLayers } from "./igua-layers";
import { IguaScene, IguaSceneStack } from "./igua-scene-stack";
import { Collision } from "../lib/pixi/collision";
import { setDefaultStages } from "../lib/game-engine/default-stages";

export let renderer: PixiRenderer;

const rootStage = new Container();
const layers = new IguaLayers(rootStage);

export let scene: IguaScene;
export const sceneStack = new IguaSceneStack(layers, (_scene) => scene = _scene);

export function installGlobals(_renderer: PixiRenderer) {
    renderer = _renderer;

    const ticker = new AsshatTicker();

    KeyListener.start();

    const rectangle = new Rectangle();

    ticker.add(() => {
        AsshatZoneDiagnostics.printHandledCancellationErrors();
        KeyListener.advance();
        // TODO need to make a better effort to understand what cost .getBounds has
        // and how "out of date" bounds data can be
        scene?.stage.getBounds(false, rectangle);
        scene?.ticker.tick();
        Collision.recycleRectangles();
    });

    const animator = new Animator(60);
    animator.start();

    animator.add(() => {
        ticker.tick();
        renderer.render(rootStage);
    });

    setDefaultStages({
        get show() {
            return scene.stage;
        }
    });
}
