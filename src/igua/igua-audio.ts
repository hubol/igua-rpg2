import { Logging } from "../lib/logging";
import { intervalWait } from "../lib/browser/interval-wait";
import { AsshatAudioContext } from "../lib/game-engine/audio/asshat-audiocontext";
import { Sound } from "../lib/game-engine/audio/sound";
import { AsshatJukebox } from "../lib/game-engine/audio/asshat-jukebox";

class IguaAudioImpl {
    constructor(private readonly _context: AudioContext) {
        console.log(...Logging.componentArgs(this));
    }

    async createSfx(buffer: ArrayBuffer) {
        const audio = await this._context.decodeAudioData(buffer);
        // TODO could be routed to special node for environmental effects
        // e.g. reverb, delay
        return new Sound(audio, this._context.destination);
    }
}

export let IguaAudio: IguaAudioImpl;
export let Jukebox: AsshatJukebox;

export const IguaAudioInitializer = {
    async initialize() {
        await intervalWait(() => !!AsshatAudioContext);
        IguaAudio = new IguaAudioImpl(AsshatAudioContext);
        Jukebox = new AsshatJukebox(AsshatAudioContext.destination);
    },
    get initialized() {
        return !!IguaAudio;
    }
}