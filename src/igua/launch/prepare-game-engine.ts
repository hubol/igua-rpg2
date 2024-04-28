import { Animator } from "../../lib/game-engine/animator";
import { AsshatTicker } from "../../lib/game-engine/asshat-ticker";
import { AsshatZoneDiagnostics } from "../../lib/game-engine/asshat-zone";
import { setDefaultStages } from "../../lib/game-engine/default-stages";
import { PixiRenderer } from "../../lib/game-engine/pixi-renderer";
import { TickerContainer } from "../../lib/game-engine/ticker-container";
import { Collision } from "../../lib/pixi/collision";
import { devAssignDisplayObjectIdentifiers } from "../../lib/pixi/dev-assign-displayobject-identifiers";
import { IguaInput } from "../core/input";
import { scene, setIguaGlobals } from "../globals";

globalThis.onDisplayObjectConstructed = devAssignDisplayObjectIdentifiers;

const rootTicker = new AsshatTicker();
const rootStage = new TickerContainer(rootTicker, false).named("Root");

const iguaInput = new IguaInput();

export function prepareGameEngine(renderer: PixiRenderer) {
    let gameLoopForced = false;

    function forceGameLoop() {
        gameLoopForced = true;
    }

    const animator = new Animator(60);

    setIguaGlobals(renderer, rootStage, iguaInput, forceGameLoop, animator.start.bind(animator));

    iguaInput.start();

    const flashPreventer = new UnpleasantCanvasFlashPreventer(renderer);

    function gameLoop() {
        do {
            gameLoopForced = false;

            AsshatZoneDiagnostics.printHandledCancellationErrors();
            scene?.ticker.tick();
            rootTicker.tick();
            Collision.recycleRectangles();
            iguaInput.tick();
            flashPreventer.tick();
        }
        while (gameLoopForced);
        
        renderer.render(rootStage);
    }

    animator.add(gameLoop);

    setDefaultStages({
        get show() {
            return scene.stage;
        }
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