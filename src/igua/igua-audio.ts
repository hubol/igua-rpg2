import { Logging } from "../lib/logging";
import { intervalWait } from "../lib/browser/interval-wait";
import { AsshatAudioContext } from "../lib/game-engine/audio/asshat-audiocontext";
import { Sound } from "../lib/game-engine/audio/sound";
import { AsshatJukebox } from "../lib/game-engine/audio/asshat-jukebox";
import { Unit } from "../lib/math/number-alias-types";

class IguaAudioImpl {
    private readonly _globalGainNode: GainNode;
    readonly jukebox: AsshatJukebox;

    constructor(private readonly _context: AudioContext) {
        console.log(...Logging.componentArgs(this));

        this._globalGainNode = new GainNode(_context);
        this._globalGainNode.connect(this._context.destination);

        this.jukebox = new AsshatJukebox(this._globalGainNode);
    }

    async createSfx(buffer: ArrayBuffer) {
        const audio = await this._context.decodeAudioData(buffer);
        // TODO could be routed to special node for environmental effects
        // e.g. reverb, delay
        return new Sound(audio, this._globalGainNode);
    }

    set globalGain(value: Unit) {
        this._globalGainNode.gain.value = value;
    }
}

export let IguaAudio: IguaAudioImpl;
export let Jukebox: AsshatJukebox;

export const IguaAudioInitializer = {
    async initialize() {
        await intervalWait(() => !!AsshatAudioContext);
        IguaAudio = new IguaAudioImpl(AsshatAudioContext);
        Jukebox = IguaAudio.jukebox;
    },
    get initialized() {
        return !!IguaAudio;
    }
}