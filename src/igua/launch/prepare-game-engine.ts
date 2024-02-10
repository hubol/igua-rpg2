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

    iguaInput.start();

    const flashPreventer = new UnpleasantCanvasFlashPreventer(renderer);

    function gameLoop() {
        AsshatZoneDiagnostics.printHandledCancellationErrors();
        scene?.ticker.tick();
        rootTicker.tick();
        Collision.recycleRectangles();
        iguaInput.tick();
        flashPreventer.tick();
        renderer.render(rootStage);
    }

    const animator = new Animator(60);
    animator.start();

    animator.add(gameLoop);

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

class UnpleasantCanvasFlashPreventer {
    private _completed = false;

    constructor(private readonly _renderer: PixiRenderer) {
        this._renderer.view.style.opacity = '0';
    }

    tick() {
        if (this._completed)
            return;
        this._renderer.view.style.opacity = '';
        this._completed = true;
    }
}