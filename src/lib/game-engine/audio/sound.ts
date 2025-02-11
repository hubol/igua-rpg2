import { Polar, Seconds, Unit } from "../../math/number-alias-types";
import { StereoGainNode, StereoGainNodePool } from "./stereo-gain-node-pool";

export class Sound {
    private readonly _gainNodePool: StereoGainNodePool;
    private readonly _context: BaseAudioContext;

    gain = 1;
    pan = 0;
    rate = 1;
    loop = false;

    private readonly _with = new SoundWith(this);

    get with() {
        this.gain = 1;
        this.pan = 0;
        this.rate = 1;
        this.loop = false;
        return this._with;
    }

    constructor(private readonly _buffer: AudioBuffer, destination: AudioNode) {
        this._context = destination.context;
        this._gainNodePool = StereoGainNodePool.get(destination);
    }

    play(offset?: Seconds) {
        const source = this._createSourceNode();
        this._createStereoGainNode(source);
        source.start(undefined, offset);
    }

    playInstance(offset?: Seconds) {
        const source = this._createSourceNode();
        const stereoGainNode = this._createStereoGainNode(source);
        source.start(undefined, offset);
        return new SoundInstance(source, stereoGainNode);
    }

    private _createSourceNode() {
        const source = this._context.createBufferSource();
        source.buffer = this._buffer;
        source.playbackRate.value = this.rate;
        source.loop = this.loop;
        return source;
    }

    private _createStereoGainNode(source: AudioBufferSourceNode) {
        const stereoGainNode = this._gainNodePool.connectInput(source);
        stereoGainNode.gain.value = this.gain;
        stereoGainNode.pan.value = this.pan;
        return stereoGainNode;
    }
}

type RampableParam = "rate" | "gain" | "pan";

export class SoundInstance {
    constructor(private readonly _sourceNode: AudioBufferSourceNode, private readonly _stereoGainNode: StereoGainNode) {
    }

    private _getAudioParam(param: RampableParam) {
        switch (param) {
            case "rate":
                return this._sourceNode.playbackRate;
            case "gain":
                return this._stereoGainNode.gain;
            case "pan":
                return this._stereoGainNode.pan;
        }
    }

    linearRamp(param: RampableParam, value: number, durationSeconds: Seconds) {
        const audioParam = this._getAudioParam(param);
        const currentValue = audioParam.value;
        const currentTime = this._sourceNode.context.currentTime;

        // Doesn't totally make sense to me
        // But without this, nodes with multiple automations applied
        // Will not sound as expected
        // Observed this approach in HowlerJS as well
        // https://github.com/goldfire/howler.js/blob/a2a47933f1ffcee659e4939a65e075fa7f25706c/src/howler.core.js#L1336-L1337
        audioParam.setValueAtTime(currentValue, currentTime);
        audioParam.linearRampToValueAtTime(
            value,
            currentTime + durationSeconds,
        );
        return this;
    }

    get gain() {
        return this._stereoGainNode.gain.value;
    }

    set gain(value: Unit) {
        this._stereoGainNode.gain.value = value;
    }

    get pan() {
        return this._stereoGainNode.pan.value;
    }

    set pan(value: Unit) {
        this._stereoGainNode.pan.value = value;
    }

    get rate() {
        return this._sourceNode.playbackRate.value;
    }

    set rate(value: number) {
        this._sourceNode.playbackRate.value = value;
    }

    get loop() {
        return this._sourceNode.loop;
    }

    set loop(value: boolean) {
        this._sourceNode.loop = value;
    }

    stop() {
        this._sourceNode.stop();
    }
}

export class SoundWith {
    constructor(private readonly _sound: Sound) {
    }

    rate(rate: number) {
        this._sound.rate = rate;
        return this;
    }

    gain(gain: Unit) {
        this._sound.gain = gain;
        return this;
    }

    pan(pan: Polar) {
        this._sound.pan = pan;
        return this;
    }

    loop(loop = true) {
        this._sound.loop = loop;
        return this;
    }

    play(offset?: Seconds) {
        return this._sound.play(offset);
    }

    playInstance(offset?: Seconds) {
        return this._sound.playInstance(offset);
    }
}

// TODO there's some copy-paste here, maybe there's a way to eliminate it
