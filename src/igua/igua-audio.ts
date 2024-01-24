import { Logging } from "../lib/logging";
import { intervalWait } from "../lib/browser/interval-wait";
import { AsshatAudioContext } from "../lib/game-engine/audio/asshat-audiocontext";
import { Sound } from "../lib/game-engine/audio/sound";
import { AsshatJukebox } from "../lib/game-engine/audio/asshat-jukebox";
import { Unit } from "../lib/math/number-alias-types";

class IguaAudioImpl {
    private readonly _globalGainNode: GainNode;
    private readonly _sfxGainNode: GainNode;
    private readonly _jukeboxGainNode: GainNode;

    private readonly _sfxDelayFeedbackNode: GainNode;

    readonly jukebox: AsshatJukebox;

    constructor(private readonly _context: AudioContext) {
        console.log(...Logging.componentArgs(this));

        this._globalGainNode = new GainNode(_context);
        this._globalGainNode.connect(this._context.destination);

        this._sfxDelayFeedbackNode = new GainNode(_context, { gain: 0 });
        const delay = new DelayNode(_context, { delayTime: 0.3 });
        delay.connect(this._sfxDelayFeedbackNode);
        this._sfxDelayFeedbackNode.connect(delay);
        delay.connect(this._globalGainNode);

        this._sfxGainNode = new GainNode(_context);
        this._sfxGainNode.connect(this._globalGainNode);
        this._sfxGainNode.connect(this._sfxDelayFeedbackNode);

        this._jukeboxGainNode = new GainNode(_context);
        this._jukeboxGainNode.connect(this._globalGainNode);

        this._jukeboxGainNode.gain.value = 0.2;

        this.jukebox = new AsshatJukebox(this._jukeboxGainNode);
    }

    async createSfx(buffer: ArrayBuffer) {
        const audio = await this._context.decodeAudioData(buffer);
        // TODO could be routed to special node for environmental effects
        // e.g. reverb, delay
        return new Sound(audio, this._sfxGainNode);
    }

    set sfxDelayFeedback(value: Unit) {
        this._sfxDelayFeedbackNode.gain.value = value;
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