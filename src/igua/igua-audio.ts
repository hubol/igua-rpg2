import { Logging } from "../lib/logging";
import { intervalWait } from "../lib/browser/interval-wait";
import { AsshatAudioContext } from "../lib/game-engine/asshat-audiocontext";
import { Sound } from "../lib/game-engine/sound";

class IguaAudioImpl {
    constructor(private readonly _context: AudioContext) {
        console.log(...Logging.componentArgs(this));
    }

    async createSfx(buffer: ArrayBuffer) {
        const audio = await this._context.decodeAudioData(buffer);
        // TODO could be routed to special node for environmental effects
        // e.g. reverb, delay
        return new Sound(audio, this._context.destination, this._context);
    }
}

export let IguaAudio: IguaAudioImpl;

export const IguaAudioInitializer = {
    async initialize() {
        await intervalWait(() => !!AsshatAudioContext);
        IguaAudio = new IguaAudioImpl(AsshatAudioContext);
    },
    get initialized() {
        return !!IguaAudio;
    }
}