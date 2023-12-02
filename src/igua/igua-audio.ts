import { intervalWait } from "../lib/browser/interval-wait";
import { AudioContextSafety } from "../lib/game-engine/audiocontext-safety";
import { Sound } from "../lib/game-engine/sound";

class IguaAudioImpl {
    // TODO this context should be created only after a user gesture
    // "The AudioContext was not allowed to start. It must be resumed (or created) after a user gesture on the page."
    private _context?: AudioContext;

    constructor() {
        console.log(this);
    }

    async initialize() {
        if (this._context)
            return;

        await intervalWait(() => AudioContextSafety.canAudioContextBeCreated);

        if (!this._context)
            this._context = new AudioContext();
    }

    get initialized() {
        return !!this._context;
    }

    async createSfx(buffer: ArrayBuffer) {
        if (!this._context)
            throw new Error('Attempting to IguaAudio.createSfx() before initialized!');

        const audio = await this._context.decodeAudioData(buffer);
        // TODO could be routed to special node for environmental effects
        // e.g. reverb, delay
        return new Sound(audio, this._context.destination, this._context);
    }
}

export const IguaAudio = new IguaAudioImpl();