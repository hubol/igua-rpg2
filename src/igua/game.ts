import { Graphics } from "pixi.js";
import { AsshatTicker } from "../lib/game-engine/asshat-ticker";
import { GameEngine } from "../lib/game-engine/game-engine";
import { wait } from "../lib/game-engine/wait";
import { Key, KeyListener } from "../lib/browser/key";
import { AsshatZoneDiagnostics } from "../lib/game-engine/asshat-zone";

export function startGame(engine: GameEngine) {
    const ticker = new AsshatTicker();
    engine.stage.withTicker(ticker);

    KeyListener.start();

    ticker.add(() => {
        AsshatZoneDiagnostics.printHandledCancellationErrors();
        KeyListener.advance();
    });

    for (let i = 0; i < 1280; i++) {
        const g = new Graphics().at(i * 2, i * 2).beginFill(0xff0000 + i).drawRect(0, 0, 16, 16)
            .step(() => {
                g.x = (g.x + 1) % 256;
                if (g.scale.x !== 1 && Math.random() > 0.95)
                    g.destroy();
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

    const guy = new Graphics().at(128, 128).beginFill(0xffff00).drawCircle(0, 0, 16)
        .step(() => {
            if (Key.isDown('ArrowUp'))
                guy.y -= 4;
            if (Key.isDown('ArrowDown'))
                guy.y += 4;
            if (Key.isDown('ArrowLeft'))
                guy.x -= 4;
            if (Key.isDown('ArrowRight'))
                guy.x += 4;
        })

    engine.stage.addChild(guy);

    engine.animator.add(() => {
        ticker.update();
        engine.render(engine.stage);
    });
}