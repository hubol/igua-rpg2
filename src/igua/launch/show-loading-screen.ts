import { JobProgress } from "../../lib/game-engine/job-progress";
import { Environment } from "../../lib/environment";
import { approachLinear } from "../../lib/math/number";
import { timeoutSleep } from "../../lib/browser/timeout-sleep";

export async function showLoadingScreen(progress: JobProgress) {
    let unit = 0;
    const shouldResolve = createShouldResolve(progress);

    const preloadEl = document.querySelector<HTMLElement>("#preload")!;
    preloadEl.style.opacity = "0";

    const el = document.querySelector<HTMLElement>("#loading_bar .front")!;

    await new Promise<void>(resolve => {
        const render = () => {
            if (shouldResolve(unit)) {
                return resolve();
            }

            unit = approachLinear(unit, progress.percentage, 1 / 60);
            el.style.width = `${unit * 100}%`;

            requestAnimationFrame(render);
        };

        render();
    });

    const loadingEl = document.getElementById("loading")!;

    if (!Environment.isDev) {
        loadingEl.classList.add("hide");
        await timeoutSleep(200);
    }

    loadingEl.remove();
}

function createShouldResolve(progress: JobProgress) {
    if (Environment.isDev) {
        return (unit: number) => progress.completed;
    }

    return (unit: number) => progress.completed && unit >= 1;
}
