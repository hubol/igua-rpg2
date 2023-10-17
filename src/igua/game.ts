import { Graphics } from "pixi.js";
import { AsshatTicker } from "../lib/game-engine/asshat-ticker";
import { GameEngine } from "../lib/game-engine/game-engine";

export function startGame(engine: GameEngine) {
    const ticker = new AsshatTicker();

    const g = new Graphics().beginFill(0xff0000).drawRect(0, 0, 16, 16);
    engine.stage.addChild(g);

    engine.animator.add(() => {
        ticker.update();
        engine.render(engine.stage);
    });

    ticker.add(() => {
        g.x = (g.x + 1) % 256;
    });
}