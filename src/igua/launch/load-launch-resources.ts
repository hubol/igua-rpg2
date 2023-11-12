import { loadTextureAssets } from "../../assets/textures";
import { JobProgress } from "../../lib/game-engine/job-progress";

export async function loadLaunchResources(progress: JobProgress) {
    await loadTextureAssets(progress);
    progress.complete();
}