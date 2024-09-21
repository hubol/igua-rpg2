import { Seconds, Unit } from "../../math/number-alias-types";

export class Sound {
    private readonly _gainNode: GainNode;
    private readonly _context: BaseAudioContext;

    rate = 1;
    loop = false;
    with = new SoundWith(this);

    constructor(private readonly _buffer: AudioBuffer, destination: AudioNode) {
        this._context = destination.context;
        this._gainNode = new GainNode(this._context);
        this._gainNode.connect(destination);
    }

    get gain() {
        return this._gainNode.gain.value;
    }

    set gain(value: Unit) {
        this._gainNode.gain.value = value;
    }

    play(offset?: Seconds) {
        const source = this._createSourceNode();
        source.start(undefined, offset);
    }

    playInstance(offset?: Seconds) {
        const source = this._createSourceNode();
        source.start(undefined, offset);
        return new SoundInstance(source, this._gainNode);
    }

    private _createSourceNode() {
        const source = this._context.createBufferSource();
        source.buffer = this._buffer;
        source.playbackRate.value = this.rate;
        source.loop = this.loop;
        source.connect(this._gainNode);
        return source;
    }
}

type RampableParam = "rate" | "gain";

export class SoundInstance {
    constructor(private readonly _sourceNode: AudioBufferSourceNode, private readonly _gainNode: GainNode) {
    }

    private _getAudioParam(param: RampableParam) {
        switch (param) {
            case "rate":
                return this._sourceNode.playbackRate;
            case "gain":
                return this._gainNode.gain;
        }
    }

    linearRamp(param: RampableParam, value: number, durationSeconds: Seconds) {
        this._getAudioParam(param).linearRampToValueAtTime(
            value,
            this._sourceNode.context.currentTime + durationSeconds,
        );
        return this;
    }

    get gain() {
        return this._gainNode.gain.value;
    }

    set gain(value: Unit) {
        this._gainNode.gain.value = value;
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

class SoundWith {
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
// TODO could be nice to expose panning as well
