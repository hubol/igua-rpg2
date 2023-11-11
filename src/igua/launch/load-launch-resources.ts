import { JobProgress } from "../../lib/game-engine/job-progress";

export function loadLaunchResources(progress: JobProgress) {
    // TODO this is fake for now
    return new Promise<void>(resolve => {
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