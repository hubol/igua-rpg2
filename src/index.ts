import { loadLaunchResources } from "./igua/launch/load-launch-resources";
import { showLoadingScreen } from "./igua/launch/show-loading-screen";
import { integralUpscaleCanvas } from "./lib/browser/integral-upscale-canvas";
import { Animator } from "./lib/game-engine/animator";
import { createDomErrorAnnouncer } from "./lib/game-engine/dom-error-announcer";
import { ErrorReporter } from "./lib/game-engine/error-reporter";
import { GameEngine } from "./lib/game-engine/game-engine";
import { JobProgress } from "./lib/game-engine/job-progress";

async function initialize() {
    try {
        const animator = new Animator(60);
        const engine = new GameEngine(animator, {
            width: 256,
            height: 256,
            eventFeatures: { click: false, globalMove: false, move: false, wheel: false, },
            eventMode: "none",
        });

        await installExtensions();

        const progress = new JobProgress();
        const loadResources = loadLaunchResources(progress);

        integralUpscaleCanvas(addGameCanvasToDocument(engine.canvasElement))
        animator.start();
        await showLoadingScreen(engine, progress);

        await loadResources;
        
        require("./igua/globals").installGlobals(engine);
        require("./igua/game").startGame();
    }
    catch (e) {
        console.error(e);
        showFatalError(e);
    }
}

async function installExtensions() {
    require("./lib/extensions");
    // Have observed bizarre behavior with Dexie
    // (In particular, PSD values seem to be missing)
    // without "flushing" Promises after requiring extensions...
    await new Promise(r => setTimeout(r));
}

function showFatalError(error) {
    const message = typeof error === 'string' ? error : ( error?.message ? error.message : JSON.stringify(error) );
    document.body.id = 'fatal_error';
    document.body.innerHTML = `<h1>Error in initialization</h1>
<h2>${message}</h2>`;
}

window.onload = initialize;

window.addEventListener("unhandledrejection", (e) => ErrorReporter.reportUnhandledError(e.reason));
window.addEventListener("error", (e) => ErrorReporter.reportUnhandledError(e));

ErrorReporter.announcer = createDomErrorAnnouncer();

function addGameCanvasToDocument(element: HTMLCanvasElement) {
    element.id = "game_canvas";
    document.body.appendChild(element);

    return element;
}
