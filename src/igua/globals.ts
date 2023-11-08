import { KeyListener } from "../lib/browser/key";
import { AsshatTicker } from "../lib/game-engine/asshat-ticker";
import { AsshatZoneDiagnostics } from "../lib/game-engine/asshat-zone";
import { GameEngine } from "../lib/game-engine/game-engine";
import { IguaScene, IguaSceneStack } from "./igua-scene-stack";

export let engine: GameEngine;

export let scene: IguaScene;
export const sceneStack = new IguaSceneStack((_scene) => scene = _scene);

export function installGlobals(_engine: GameEngine) {
    engine = _engine;

    const ticker = new AsshatTicker();

    KeyListener.start();

    ticker.add(() => {
        AsshatZoneDiagnostics.printHandledCancellationErrors();
        KeyListener.advance();
        scene?.ticker.update();
    });

    engine.animator.add(() => {
        ticker.update();
        engine.render(engine.stage);
    });
}
