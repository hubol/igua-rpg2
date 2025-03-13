import { Polar, Seconds, Unit } from "../../math/number-alias-types";
import { Rng } from "../../math/rng";
import { StereoGainNode, StereoGainNodePool } from "./stereo-gain-node-pool";

export class Sound {
    private readonly _gainNodePool: StereoGainNodePool;
    private readonly _context: BaseAudioContext;

    private readonly _params = {
        gain: 1 as Unit,
        pan: 0 as Polar,
        rate: 1,
        loop: false,
    };

    constructor(private readonly _buffer: AudioBuffer, destination: AudioNode) {
        this._context = destination.context;
        this._gainNodePool = StereoGainNodePool.get(destination);
    }

    gain(value: Unit) {
        this._params.gain = value;
        return this;
    }

    pan(value: Polar) {
        this._params.pan = value;
        return this;
    }

    rate(min: number, max: number): Sound;
    rate(value: number): Sound;
    rate(min_value: number, max?: number) {
        this._params.rate = typeof max === "number" ? Rng.float(min_value, max) : min_value;
        return this;
    }

    loop(value = true) {
        this._params.loop = value;
        return this;
    }

    play(offset?: Seconds) {
        const source = this._createSourceNode();
        this._createStereoGainNode(source);
        source.start(undefined, offset);
        this._resetParams();
    }

    playInstance(offset?: Seconds) {
        const source = this._createSourceNode();
        const stereoGainNode = this._createStereoGainNode(source);
        source.start(undefined, offset);
        this._resetParams();
        return new SoundInstance(source, stereoGainNode);
    }

    private _createSourceNode() {
        const source = this._context.createBufferSource();
        source.buffer = this._buffer;
        source.playbackRate.value = this._params.rate;
        source.loop = this._params.loop;
        return source;
    }

    private _createStereoGainNode(source: AudioBufferSourceNode) {
        const stereoGainNode = this._gainNodePool.connectInput(source);
        stereoGainNode.gain.value = this._params.gain;
        stereoGainNode.pan.value = this._params.pan;
        return stereoGainNode;
    }

    private _resetParams() {
        this._params.gain = 1;
        this._params.loop = false;
        this._params.pan = 0;
        this._params.rate = 1;
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
