import { loadFontAssets } from "../../assets/fonts";
import { loadSoundAssets } from "../../assets/sounds";
import { loadTextureAssets } from "../../assets/textures";
import { JobProgress } from "../../lib/game-engine/job-progress";
import { IguaAudioInitializer } from "../core/igua-audio";

export async function loadLaunchAssets(progress: JobProgress) {
    await Promise.all([
        IguaAudioInitializer.initialize(),
        loadTextureAssets(progress),
        loadSoundAssets(progress),
        loadFontAssets(progress),
    ]);
    progress.complete();
}
