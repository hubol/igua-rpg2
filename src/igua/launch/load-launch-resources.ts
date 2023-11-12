import { loadMyTextures } from "../../generated/textures";
import { JobProgress } from "../../lib/game-engine/job-progress";

export async function loadLaunchResources(progress: JobProgress) {
    await loadMyTextures();
    await new Promise<void>(resolve => {
        progress.totalJobsCount = 100;
        const interval = setInterval(() => {
            if (progress.completedJobsCount < progress.totalJobsCount)
                progress.completedJobsCount += 1;
            else {
                progress.completed = true;
                clearInterval(interval);
                resolve();
            }
        }, 33);
    })
}