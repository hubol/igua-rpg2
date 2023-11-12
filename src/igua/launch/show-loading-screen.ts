import { Container, Graphics } from "pixi.js";
import { JobProgress } from "../../lib/game-engine/job-progress";
import { Environment } from "../../lib/environment";
import { approachLinear } from "../../lib/math/number";
import { PixiRenderer } from "../../lib/game-engine/pixi-renderer";

export function showLoadingScreen(renderer: PixiRenderer, progress: JobProgress) {
    let unit = 0;
    const shouldResolve = createShouldResolve(progress);

    return new Promise<void>(resolve => {
        const loadingStage = new Container();

        new Graphics()
            .beginFill(0xf8d800)
            .drawRect(0, 0, renderer.width, renderer.height)
            .show(loadingStage);

        const bar = new Graphics().show(loadingStage);

        const render = () => {
            if (shouldResolve(unit))
                return resolve();

            unit = approachLinear(unit, progress.percentage, 1 / 60);

            bar.clear().lineStyle({ width: 1, color: 0x800000 });

            const lines = unit * renderer.width;

            for (let i = 0; i < lines; i += 1) {
                const x = (i * 2) % renderer.width + (i > renderer.width / 2 ? 0 : 1);
                const y = renderer.height - x;
                bar.moveTo(x, y);
                bar.lineTo(x, renderer.height);
            }

            if (unit >= 1)
                bar.moveTo(renderer.width, 0).lineTo(renderer.width, renderer.height);

            renderer.render(loadingStage);
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