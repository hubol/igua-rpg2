import { Logging } from "../../lib/logging";
import { intervalWait } from "../../lib/browser/interval-wait";
import { AsshatAudioContext } from "../../lib/game-engine/audio/asshat-audiocontext";
import { Sound } from "../../lib/game-engine/audio/sound";
import { AsshatJukebox } from "../../lib/game-engine/audio/asshat-jukebox";
import { Unit } from "../../lib/math/number-alias-types";
import { StereoDelay } from "../../lib/game-engine/audio/stereo-delay";

class IguaAudioImpl {
    private readonly _globalGainNode: GainNode;
    private readonly _sfxGainNode: GainNode;
    private readonly _jukeboxGainNode: GainNode;

    private readonly _stereoDelay: StereoDelay;

    readonly jukebox: AsshatJukebox;

    constructor(private readonly _context: AudioContext) {
        console.log(...Logging.componentArgs(this));

        this._globalGainNode = new GainNode(_context);
        this._globalGainNode.connect(this._context.destination);

        this._sfxGainNode = new GainNode(_context);
        this._sfxGainNode.connect(this._globalGainNode);

        this._stereoDelay = new StereoDelay(this._globalGainNode);
        this._sfxGainNode.connect(this._stereoDelay.leftInput);
        this._sfxGainNode.connect(this._stereoDelay.rightInput);

        this._jukeboxGainNode = new GainNode(_context);
        this._jukeboxGainNode.connect(this._globalGainNode);

        this._jukeboxGainNode.gain.value = 0.5;

        this.jukebox = new AsshatJukebox(this._jukeboxGainNode);
    }

    async createSfx(buffer: ArrayBuffer) {
        const audio = await this._context.decodeAudioData(buffer);
        // TODO should every sound effect be added to this node?
        // e.g. should UI sounds receive stereo delay?
        return new Sound(audio, this._sfxGainNode);
    }

    set sfxDelayFeedback(value: Unit) {
        this._stereoDelay.leftGain.value = value;
        this._stereoDelay.rightGain.value = value;
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
    },
};
