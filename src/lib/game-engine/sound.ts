export class Sound {
    private readonly _gainNode: GainNode;
    rate = 1;
    loop = false;
    with = new SoundWith(this);

    constructor(private readonly _buffer: AudioBuffer, destination: AudioNode, private readonly _context: AudioContext) {
        this._gainNode = new GainNode(_context);
        this._gainNode.connect(destination);
    }

    get gain() {
        return this._gainNode.gain.value;
    }

    set gain(value: number) {
        this._gainNode.gain.value = value;
    }

    play() {
        const source = this._createSourceNode();
        source.start();
    }

    playInstance() {
        const source = this._createSourceNode();
        source.start();
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

class SoundInstance {
    constructor(private readonly _sourceNode: AudioBufferSourceNode, private readonly _gainNode: GainNode) {

    }

    get gain() {
        return this._gainNode.gain.value;
    }

    set gain(value: number) {
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

    gain(gain: number) {
        this._sound.gain = gain;
        return this;
    }

    loop(loop = true) {
        this._sound.loop = loop;
        return this;
    }

    play() {
        return this._sound.play();
    }

    playInstance() {
        return this._sound.playInstance();
    }
}

// TODO there's some copy-paste here, maybe there's a way to eliminate it
// TODO should the linearRamp... methods be exposed by the Sound and SoundInstance classes?
// TODO could be nice to expose panning as well