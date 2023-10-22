import { integralUpscaleCanvas } from "./lib/browser/integral-upscale-canvas";
import { Animator } from "./lib/game-engine/animator";
import { GameEngine } from "./lib/game-engine/game-engine";

async function initialize()
{
    try {
        const animator = new Animator(60);
        const engine = new GameEngine(animator, {
            width: 256,
            height: 256,
            eventFeatures: { click: false, globalMove: false, move: false, wheel: false, },
            eventMode: "none",
        });

        integralUpscaleCanvas(addGameCanvasToDocument(engine.canvasElement))
        animator.start();

        require("./lib/extensions");
        const { startGame } = require("./igua/game");
        startGame(engine);
    }
    catch (e) {
        console.error(e);
        showFatalError(e);
    }
}

function showFatalError(error) {
    const message = typeof error === 'string' ? error : ( error?.message ? error.message : JSON.stringify(error) );
    document.body.id = 'fatal_error';
    document.body.innerHTML = `<h1>Error in initialization</h1>
<h2>${message}</h2>`;
}

window.onload = initialize;

// window.addEventListener("unhandledrejection", handleIguaPromiseRejection);
// window.addEventListener("unhandledrejection", handlePromiseCancellation);

function addGameCanvasToDocument(element: HTMLCanvasElement) {
    element.id = "game_canvas";
    document.body.appendChild(element);

    return element;
}
