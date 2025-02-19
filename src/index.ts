import { settings } from "pixi.js";
import { setCurrentPixiRenderer } from "./igua/current-pixi-renderer";
import { loadLaunchAssets } from "./igua/launch/load-launch-assets";
import { showLoadingScreen } from "./igua/launch/show-loading-screen";
import { integralUpscaleCanvas } from "./lib/browser/integral-upscale-canvas";
import { Environment } from "./lib/environment";
import { initializeAsshatAudioContext } from "./lib/game-engine/audio/asshat-audiocontext";
import { DomLogTarget } from "./lib/game-engine/dom-log-target";
import { JobProgress } from "./lib/game-engine/job-progress";
import { Logger } from "./lib/game-engine/logger";
import { createPixiRenderer } from "./lib/game-engine/pixi-renderer";

let assetsLoaded = false;

// https://esbuild.github.io/api/#live-reload
if (Environment.isDev) {
    new EventSource("/esbuild").addEventListener("change", () => {
        if (assetsLoaded) {
            require("./igua/dev/dev-game-start-config").DevGameStartConfig.recordTransientGameStartConfig();
        }
        else {
            console.log("Assets were not loaded. Not recording transient game start config.");
        }
        location.reload();
    });
}

async function initialize() {
    try {
        settings.ROUND_PIXELS = true;
        const renderer = createPixiRenderer({
            width: 500,
            height: 280,
            eventFeatures: { click: false, globalMove: false, move: false, wheel: false },
            eventMode: "none",
        });
        setCurrentPixiRenderer(renderer);

        installExtensions();

        const progress = new JobProgress();

        await Promise.all([
            initializeAsshatAudioContext({
                gestureEl: () => {
                    const el = document.getElementById("user_gesture")!;
                    el.classList.add("show");
                    return el;
                },
                cleanup: (el) => {
                    el.classList.remove("show");
                    el.classList.add("hide");
                },
            }),
            loadLaunchAssets(progress),
            showLoadingScreen(progress),
        ]);

        assetsLoaded = true;

        integralUpscaleCanvas(addGameCanvasToDocument(renderer.view));

        require("./igua/launch/prepare-game-engine").prepareGameEngine(renderer);
        require("./igua/launch/install-dev-tools").installDevTools();
        require("./igua/launch/start-game").startGame();
    }
    catch (e) {
        console.error(e);
        showFatalError(e);
    }
}

function installExtensions() {
    require("./lib/extensions/-load-extensions");
}

function showFatalError(error) {
    const message = typeof error === "string" ? error : (error?.message ? error.message : JSON.stringify(error));
    document.body.id = "fatal_error";
    document.body.innerHTML = `<h1>Error in initialization</h1>
<h2>${message}</h2>`;
}

window.onload = initialize;

window.addEventListener(
    "unhandledrejection",
    (e) => Logger.logUnhandledError("window.on('unhandledrejection')", e.reason),
);
window.addEventListener("error", (e) => Logger.logUnhandledError("window.on('error')", e));

Logger.target = new DomLogTarget();

function addGameCanvasToDocument(element: HTMLCanvasElement) {
    element.id = "game_canvas";
    document.getElementsByTagName("main")[0].appendChild(element);

    return element;
}
