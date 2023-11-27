import { Sound } from "../lib/game-engine/sound";

class IguaAudioImpl {
    // TODO this context should be created only after a user gesture
    // "The AudioContext was not allowed to start. It must be resumed (or created) after a user gesture on the page."
    private readonly _context = new AudioContext();

    constructor() {
        console.log(this);
    }

    async createSfx(buffer: ArrayBuffer) {
        const audio = await this._context.decodeAudioData(buffer);
        // TODO could be routed to special node for environmental effects
        // e.g. reverb, delay
        return new Sound(audio, this._context.destination, this._context);
    }
}

export const IguaAudio = new IguaAudioImpl();