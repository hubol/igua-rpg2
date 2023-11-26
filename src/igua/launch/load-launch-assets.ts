import { loadSoundAssets } from "../../assets/sounds";
import { loadTextureAssets } from "../../assets/textures";
import { JobProgress } from "../../lib/game-engine/job-progress";

export async function loadLaunchAssets(progress: JobProgress) {
    await Promise.all([
        loadTextureAssets(progress),
        loadSoundAssets(progress),
    ]);
    progress.complete();
}