import { Graphics } from "pixi.js";
import { AsshatTicker } from "../lib/game-engine/asshat-ticker";
import { GameEngine } from "../lib/game-engine/game-engine";
import { wait } from "../lib/game-engine/wait";

export function startGame(engine: GameEngine) {
    const ticker = new AsshatTicker();
    engine.stage.withTicker(ticker);

    for (let i = 0; i < 1280; i++) {
        const g = new Graphics().at(i * 2, i * 2).beginFill(0xff0000 + i).drawRect(0, 0, 16, 16)
            .step(() => {
                g.x = (g.x + 1) % 256;
            })
            .async(async () => {
                while (true) {
                    let ticks = Math.random() * 60 * 4;
                    await wait(() => ticks-- <= 0);
                    g.scale.x = -1 + Math.random() * 2;
                }
            });

        engine.stage.addChild(g);
    }

    engine.animator.add(() => {
        ticker.update();
        engine.render(engine.stage);
    });
}