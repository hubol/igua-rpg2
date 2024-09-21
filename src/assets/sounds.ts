import { unzip } from "unzipit";
import { JobProgress } from "../lib/game-engine/job-progress";
import { GeneratedSfxData } from "./generated/sounds/generated-sfx-data";

// @ts-expect-error
import oggSoundsZipUrl from "./generated/sounds/sounds-ogg.zip";
import { RequireCapability } from "../lib/browser/capabilities";
import { IguaAudio, IguaAudioInitializer } from "../igua/core/igua-audio";
import { Sound } from "../lib/game-engine/audio/sound";
import { intervalWait } from "../lib/browser/interval-wait";

const { sfxs } = GeneratedSfxData;

type Sfxs = typeof sfxs<Sound>;
type Sounds = Awaited<ReturnType<Sfxs>>;

export let Sfx: Sounds = <any> {};

export async function loadSoundAssets(progress: JobProgress) {
    RequireCapability("oggSupport");

    const soundsToLoadCount = Object.keys(GeneratedSfxData).length;
    progress.increaseTotalJobsCount(soundsToLoadCount * 2);

    const entries = (await unzip(oggSoundsZipUrl)).entries;

    progress.increaseCompletedJobsCount(soundsToLoadCount);

    await intervalWait(() => IguaAudioInitializer.initialized);

    Sfx = await sfxs(async ogg => {
        const buffer = await entries[ogg].arrayBuffer();
        const sound = await IguaAudio.createSfx(buffer);
        progress.increaseCompletedJobsCount(1);
        return sound;
    });
}
