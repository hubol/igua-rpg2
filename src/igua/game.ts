import { Graphics } from "pixi.js";
import { AsshatTicker } from "../lib/game-engine/asshat-ticker";
import { GameEngine } from "../lib/game-engine/game-engine";

export function startGame(engine: GameEngine) {
    const ticker = new AsshatTicker();
    engine.stage.withTicker(ticker);

    for (let i = 0; i < 1280; i++) {
        const g = new Graphics().at(i * 2, i * 2).beginFill(0xff0000 + i).drawRect(0, 0, 16, 16)
            .step(() => {
                g.x = (g.x + 1) % 256;
            });

        engine.stage.addChild(g);
    }

    engine.animator.add(() => {
        ticker.update();
        engine.render(engine.stage);
    });
}