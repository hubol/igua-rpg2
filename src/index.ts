import { loadLaunchAssets } from "./igua/launch/load-launch-assets";
import { showLoadingScreen } from "./igua/launch/show-loading-screen";
import { integralUpscaleCanvas } from "./lib/browser/integral-upscale-canvas";
import { createDomErrorAnnouncer } from "./lib/game-engine/dom-error-announcer";
import { ErrorReporter } from "./lib/game-engine/error-reporter";
import { createPixiRenderer } from "./lib/game-engine/pixi-renderer";
import { JobProgress } from "./lib/game-engine/job-progress";
import { initializeAsshatAudioContext } from "./lib/game-engine/asshat-audiocontext";
import { Environment } from "./lib/environment";
import { settings } from "pixi.js";

// https://esbuild.github.io/api/#live-reload
if (Environment.isDev)
    new EventSource('/esbuild').addEventListener('change', () => location.reload())

async function initialize() {
    try {
        settings.ROUND_PIXELS = true;
        const renderer = createPixiRenderer({
            width: 256,
            height: 256,
            eventFeatures: { click: false, globalMove: false, move: false, wheel: false, },
            eventMode: "none",
        });

        await installExtensions();

        const progress = new JobProgress();

        await Promise.all([
            initializeAsshatAudioContext({
                gestureEl: () => {
                    const el = document.getElementById('user_gesture')!;
                    el.classList.add('show');
                    return el;
                },
                cleanup: (el) => {
                    el.classList.remove('show');
                    el.classList.add('hide');
                }
            }),
            loadLaunchAssets(progress),
            showLoadingScreen(progress),
        ]);

        integralUpscaleCanvas(addGameCanvasToDocument(renderer.view));
        
        require("./igua/globals").installGlobals(renderer);
        require("./igua/launch/start-game").startGame();
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
    document.getElementsByTagName('main')[0].appendChild(element);

    return element;
}
