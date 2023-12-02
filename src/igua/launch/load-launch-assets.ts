import { loadSoundAssets } from "../../assets/sounds";
import { loadTextureAssets } from "../../assets/textures";
import { JobProgress } from "../../lib/game-engine/job-progress";
import { IguaAudio } from "../igua-audio";

export async function loadLaunchAssets(progress: JobProgress) {
    await Promise.all([
        IguaAudio.initialize(),
        loadTextureAssets(progress),
        loadSoundAssets(progress),
    ]);
    progress.complete();
}