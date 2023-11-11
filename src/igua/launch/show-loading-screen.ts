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

            unit = approachLinear(unit, progress.percentage, 1 / 30);

            const x = engine.width * unit;

            bar.clear().beginFill(0x800000)
                .moveTo(0, engine.height)
                .lineTo(x, engine.height * (1 - unit))
                .lineTo(x, engine.height)
                .closePath()

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