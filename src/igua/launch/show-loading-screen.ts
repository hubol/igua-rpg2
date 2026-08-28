import { timeoutSleep } from "../../lib/browser/timeout-sleep";
import { Environment } from "../../lib/environment";
import { JobProgress } from "../../lib/game-engine/job-progress";
import { approachLinear } from "../../lib/math/number";

export async function showLoadingScreen(progress: JobProgress) {
    if (Environment.isProduction) {
        await showAnimatedLoadingScreen(progress);
    }

    dom.loadingEl.remove();
}

async function showAnimatedLoadingScreen(progress: JobProgress) {
    let unit = 0;

    dom.preloadEl.style.opacity = "0";

    await new Promise<void>(resolve => {
        const render = () => {
            if (progress.completed && unit >= 1) {
                return resolve();
            }

            unit = approachLinear(unit, progress.percentage, 1 / 60);
            dom.loadingBarEl.style.width = `${unit * 100}%`;

            requestAnimationFrame(render);
        };

        render();
    });

    dom.loadingEl.classList.add("hide");
    await timeoutSleep(200);
}

const dom = {
    get preloadEl() {
        return document.querySelector<HTMLElement>("#preload")!;
    },
    get loadingEl() {
        return document.querySelector<HTMLElement>("#loading")!;
    },
    get loadingBarEl() {
        return document.querySelector<HTMLElement>("#loading_bar .front")!;
    },
};
