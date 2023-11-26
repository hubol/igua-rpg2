import { unzip } from "unzipit";
import { JobProgress } from "../lib/game-engine/job-progress";
import { GeneratedSfxData } from "./generated/sounds";

// @ts-expect-error
import oggSoundsZipUrl from "./generated/sounds/sounds-ogg.zip";
import { Capabilities, CapabilitiesError } from "../lib/browser/capabilities";

type SoundId = keyof typeof GeneratedSfxData;

export const Sfx: Record<SoundId, HTMLAudioElement> = <any>{};

export async function loadSoundAssets(progress: JobProgress) {
    if (!Capabilities.oggSupport)
        throw new CapabilitiesError(`Your browser does not support the OGG audio format.
Safari is known to not support this format.`);

    const soundsToLoadCount = Object.keys(GeneratedSfxData).length;
    progress.increaseTotalJobsCount(soundsToLoadCount);

    const entries = (await unzip(oggSoundsZipUrl)).entries;

    await Promise.all(Object.entries(GeneratedSfxData)
        .map(async ([soundId, { ogg }]) => {
            const audio = document.createElement('audio');

            const blob = await entries[ogg].blob('audio/ogg');
            const b64 = URL.createObjectURL(blob);
            // Would prefer srcObject, but it does not have wide support for Blob
            // https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/srcObject
            audio.src = b64;

            Sfx[soundId] = audio;
            progress.increaseCompletedJobsCount(1);
        }));

    // window.Sfx = Sfx;
}
