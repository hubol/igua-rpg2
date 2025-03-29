import { intervalWait } from "../../browser/interval-wait";
import { timeoutSleep } from "../../browser/timeout-sleep";
import { Milliseconds } from "../../math/number-alias-types";
import { Sound, SoundInstance } from "./sound";

export type MusicTrack = string & { readonly __t: unique symbol };

interface NowPlaying {
    track: MusicTrack;
    instance: SoundInstance;
}

// TODO generics?
export class AsshatJukebox {
    private readonly _loader: MusicTrackLoader;
    private _nowPlaying?: NowPlaying;

    constructor(private readonly _destination: AudioNode) {
        this._loader = new MusicTrackLoader(_destination);
    }

    play(track: MusicTrack, fadeOutMs: Milliseconds = 1000) {
        setTimeout(() => this.playAsync(track, fadeOutMs));
        return this;
    }

    private _latestPlayRequest?: MusicTrack;

    async playAsync(track: MusicTrack, fadeOutMs: Milliseconds = 1000) {
        if (this._latestPlayRequest === track) {
            return;
        }
        this._latestPlayRequest = track;
        if (this._nowPlaying?.track === track) {
            this._nowPlaying.instance.linearRamp("gain", 1, 1);
            return;
        }
        if (this._nowPlaying) {
            this._nowPlaying.instance.linearRamp("gain", 0, fadeOutMs / 1000);
        }
        const [sound] = await Promise.all([
            this._loader.load(track),
            ...this._nowPlaying ? [timeoutSleep(fadeOutMs)] : [],
        ]);
        if (this._latestPlayRequest === track) {
            this._nowPlaying?.instance?.stop();
            const instance = sound.loop(true).playInstance();
            this._nowPlaying = { track, instance };
        }
    }

    warm(...tracks: MusicTrack[]) {
        setTimeout(() => this.warmAsync(...tracks));
        return this;
    }

    async warmAsync(...tracks: MusicTrack[]) {
        await Promise.all(tracks.map(x => this._loader.load(x)));
    }
}

class MusicTrackLoader {
    private readonly _loaded: Record<MusicTrack, Sound> = {};
    private readonly _loading = new Set<MusicTrack>();

    constructor(private readonly _destination: AudioNode) {
    }

    async load(track: MusicTrack) {
        if (this._loaded[track]) {
            return this._loaded[track];
        }

        if (!this._loading.has(track)) {
            this._loading.add(track);
            const arrayBuffer = await fetch(track).then(x => x.arrayBuffer());
            const audioBuffer = await this._destination.context.decodeAudioData(arrayBuffer);
            this._loading.delete(track);
            const sound = new Sound(audioBuffer, this._destination);
            return this._loaded[track] = sound;
        }

        await intervalWait(() => !!this._loaded[track]);
        return this._loaded[track];
    }
}
