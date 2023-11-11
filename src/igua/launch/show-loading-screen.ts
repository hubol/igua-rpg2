import { Container, Graphics } from "pixi.js";
import { JobProgress } from "../../lib/game-engine/job-progress";
import { GameEngine } from "../../lib/game-engine/game-engine";
import { Environment } from "../../lib/environment";
import { approachLinear } from "../../lib/math/number";

export function showLoadingScreen(engine: GameEngine, progress: JobProgress) {
    let unit = 0;
    const shouldResolve = createShouldResolve(progress);

    return new Promise<void>(resolve => {
        const loadingStage = new Container();

        new Graphics()
            .beginFill(0xf8d800)
            .drawRect(0, 0, engine.width, engine.height)
            .show(loadingStage);

        const bar = new Graphics().show(loadingStage);

        const render = () => {
            if (shouldResolve(unit))
                return resolve();

            unit = approachLinear(unit, progress.percentage, 1 / 60);

            bar.clear().lineStyle({ width: 1, color: 0x800000 });

            const lines = unit * engine.width;

            for (let i = 0; i < lines; i += 1) {
                const x = (i * 2) % engine.width + (i > engine.width / 2 ? 0 : 1);
                const y = engine.height - x;
                bar.moveTo(x, y);
                bar.lineTo(x, engine.height);
            }

            if (unit >= 1)
                bar.moveTo(engine.width, 0).lineTo(engine.width, engine.height);

            engine.render(loadingStage);
            requestAnimationFrame(render);
        }

        render();
    });
}

function createShouldResolve(progress: JobProgress) {
    if (Environment.isDev)
    return (unit: number) => progress.completed;

    return (unit: number) => progress.completed && unit >= 1;
}