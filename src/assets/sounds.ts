import { unzip } from "unzipit";
import { JobProgress } from "../lib/game-engine/job-progress";
import { GeneratedSfxData } from "./generated/sounds";

// @ts-expect-error
import oggSoundsZipUrl from "./generated/sounds/sounds-ogg.zip";
import { Capabilities, CapabilitiesError } from "../lib/browser/capabilities";
import { IguaAudio, IguaAudioInitializer } from "../igua/igua-audio";
import { Sound } from "../lib/game-engine/sound";
import { intervalWait } from "../lib/browser/interval-wait";

type SoundId = keyof typeof GeneratedSfxData;

export const Sfx: Record<SoundId, Sound> = <any>{};

export async function loadSoundAssets(progress: JobProgress) {
    if (!Capabilities.oggSupport)
        throw new CapabilitiesError(`Your browser does not support the OGG audio format.
Safari is known to not support this format.`);

    const soundsToLoadCount = Object.keys(GeneratedSfxData).length;
    progress.increaseTotalJobsCount(soundsToLoadCount);

    const entries = (await unzip(oggSoundsZipUrl)).entries;

    await intervalWait(() => IguaAudioInitializer.initialized);

    await Promise.all(Object.entries(GeneratedSfxData)
        .map(async ([soundId, { ogg }]) => {
            const buffer = await entries[ogg].arrayBuffer();
            const sound = await IguaAudio.createSfx(buffer);

            Sfx[soundId] = sound;
            progress.increaseCompletedJobsCount(1);
        }));
}
