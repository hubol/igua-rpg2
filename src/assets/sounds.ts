import { unzip } from "unzipit";
import { JobProgress } from "../lib/game-engine/job-progress";
import { GeneratedSfxData } from "./generated/sounds";

// @ts-expect-error
import oggSoundsZipUrl from "./generated/sounds/sounds-ogg.zip";
import { RequireCapability } from "../lib/browser/capabilities";
import { IguaAudio, IguaAudioInitializer } from "../igua/igua-audio";
import { Sound } from "../lib/game-engine/audio/sound";
import { intervalWait } from "../lib/browser/interval-wait";

type SoundId = keyof typeof GeneratedSfxData;

export const Sfx: Record<SoundId, Sound> = <any>{};

export async function loadSoundAssets(progress: JobProgress) {
    RequireCapability('oggSupport');

    const soundsToLoadCount = Object.keys(GeneratedSfxData).length;
    progress.increaseTotalJobsCount(soundsToLoadCount * 2);

    const entries = (await unzip(oggSoundsZipUrl)).entries;

    progress.increaseCompletedJobsCount(soundsToLoadCount);

    await intervalWait(() => IguaAudioInitializer.initialized);

    await Promise.all(Object.entries(GeneratedSfxData)
        .map(async ([soundId, { ogg }]) => {
            const buffer = await entries[ogg].arrayBuffer();
            const sound = await IguaAudio.createSfx(buffer);

            Sfx[soundId] = sound;
            progress.increaseCompletedJobsCount(1);
        }));
}
