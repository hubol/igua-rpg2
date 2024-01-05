import { Container } from "pixi.js";
import { KeyListener } from "../lib/browser/key";
import { Animator } from "../lib/game-engine/animator";
import { AsshatTicker } from "../lib/game-engine/asshat-ticker";
import { AsshatZoneDiagnostics } from "../lib/game-engine/asshat-zone";
import { PixiRenderer } from "../lib/game-engine/pixi-renderer";
import { IguaLayers } from "./igua-layers";
import { IguaScene, IguaSceneStack } from "./igua-scene-stack";
import { Collision } from "../lib/pixi/collision";
import { setDefaultStages } from "../lib/game-engine/default-stages";
import { devAssignDisplayObjectIdentifiers } from "../lib/pixi/dev-assign-displayobject-identifiers";
import { createDebugPanel } from "../lib/game-engine/debug/debug-panel";

export let renderer: PixiRenderer;

globalThis.onDisplayObjectConstructed = devAssignDisplayObjectIdentifiers;

const rootStage = new Container();
const layers = new IguaLayers(rootStage);

export let scene: IguaScene;
export const sceneStack = new IguaSceneStack(layers, (_scene) => scene = _scene);

export function installGlobals(_renderer: PixiRenderer) {
    // document.body.appendChild(createDebugPanel(rootStage));

    renderer = _renderer;

    renderer.view.style.opacity = '0';

    const displayCanvas = () => {
        if (ticker.ticks >= 1) {
            ticker.remove(displayCanvas);
            renderer.view.style.opacity = '';
        }
    };

    const ticker = new AsshatTicker();

    KeyListener.start();

    ticker.add(() => {
        AsshatZoneDiagnostics.printHandledCancellationErrors();
        KeyListener.advance();
        scene?.ticker.tick();
        Collision.recycleRectangles();
    });

    ticker.add(displayCanvas);

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
