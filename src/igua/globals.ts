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
import { TickerContainer } from "../lib/game-engine/ticker-container";
import { createDebugKey } from "../lib/game-engine/debug/create-debug-key";
import { IguaAudio } from "./igua-audio";
import { WarningToast } from "../lib/game-engine/warning-toast";

export let renderer: PixiRenderer;

globalThis.onDisplayObjectConstructed = devAssignDisplayObjectIdentifiers;

const rootTicker = new AsshatTicker();
const rootStage = new TickerContainer(rootTicker).named("Root");
export const layers = new IguaLayers(rootStage);

export let scene: IguaScene;
export const sceneStack = new IguaSceneStack(layers, (_scene) => scene = _scene);

function installDevTools() {
    document.body.appendChild(createDebugPanel(rootStage));
    createDebugKey('KeyM', 'globalMute', (x, keydown) => {
        IguaAudio.globalGain = x ? 0 : 1;
        if (keydown)
            WarningToast.show(x ? 'Muted' : 'Unmuted', '^_^');
    });
}

export function installGlobals(_renderer: PixiRenderer) {
    installDevTools();

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
        rootTicker.tick();
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
