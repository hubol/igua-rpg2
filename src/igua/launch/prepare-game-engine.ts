import { Animator } from "../../lib/game-engine/animator";
import { AsshatTicker } from "../../lib/game-engine/asshat-ticker";
import { AsshatZoneDiagnostics } from "../../lib/game-engine/asshat-zone";
import { createDebugKey } from "../../lib/game-engine/debug/create-debug-key";
import { createDebugPanel } from "../../lib/game-engine/debug/debug-panel";
import { setDefaultStages } from "../../lib/game-engine/default-stages";
import { PixiRenderer } from "../../lib/game-engine/pixi-renderer";
import { TickerContainer } from "../../lib/game-engine/ticker-container";
import { WarningToast } from "../../lib/game-engine/warning-toast";
import { Collision } from "../../lib/pixi/collision";
import { devAssignDisplayObjectIdentifiers } from "../../lib/pixi/dev-assign-displayobject-identifiers";
import { IguaAudio } from "../core/igua-audio";
import { IguaInput } from "../core/input";
import { scene, setIguaGlobals } from "../globals";

globalThis.onDisplayObjectConstructed = devAssignDisplayObjectIdentifiers;

const rootTicker = new AsshatTicker();
const rootStage = new TickerContainer(rootTicker).named("Root");

const iguaInput = new IguaInput();

export function prepareGameEngine(renderer: PixiRenderer) {
    setIguaGlobals(renderer, rootStage, iguaInput);
    installDevTools();

    const ticker = new AsshatTicker();

    iguaInput.start();

    ticker.add(() => {
        AsshatZoneDiagnostics.printHandledCancellationErrors();
        scene?.ticker.tick();
        rootTicker.tick();
        Collision.recycleRectangles();
        iguaInput.tick();
    });

    preventUnpleasantCanvasFlash(renderer, ticker);

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

function installDevTools() {
    document.body.appendChild(createDebugPanel(rootStage));
    createDebugKey('KeyM', 'globalMute', (x, keydown) => {
        IguaAudio.globalGain = x ? 0 : 1;
        if (keydown)
            WarningToast.show(x ? 'Muted' : 'Unmuted', '^_^');
    });
}

function preventUnpleasantCanvasFlash(renderer: PixiRenderer, ticker: AsshatTicker) {
    renderer.view.style.opacity = '0';

    const displayCanvas = () => {
        if (ticker.ticks >= 1) {
            ticker.remove(displayCanvas);
            renderer.view.style.opacity = '';
        }
    };

    ticker.add(displayCanvas);
}
