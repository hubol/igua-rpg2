import { intervalWait } from "../../browser/interval-wait";
import { Sound, SoundInstance } from "./sound";

export type MusicTrack = string & { readonly __t: unique symbol; };

// TODO generics?
export class AsshatJukebox {
    private readonly _loader: MusicTrackLoader;
    private _current?: SoundInstance;

    constructor(private readonly _destination: AudioNode) {
        this._loader = new MusicTrackLoader(_destination);
    }

    play(track: MusicTrack) {
        setTimeout(() => this.playAsync(track));
        return this;
    }

    private _latestPlayRequest?: MusicTrack;

    async playAsync(track: MusicTrack) {
        this._latestPlayRequest = track;
        const sound = await this._loader.load(track);
        this._current?.stop();
        if (this._latestPlayRequest == track)
            this._current = sound.with.loop(true).playInstance();
    }

    /** @noprommy */
    async warm(...tracks: MusicTrack[]) {
        setTimeout(() => this.warmAsync(...tracks));
        return this;
    }

    /** @noprommy */
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
        if (this._loaded[track])
            return this._loaded[track];

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