export class StereoDelay {
    private readonly _leftDelayNode: DelayNode;
    private readonly _rightDelayNode: DelayNode;

    private readonly _leftFeedbackNode: GainNode;
    private readonly _rightFeedbackNode: GainNode;

    constructor(output: AudioNode) {
        const context = output.context;

        this._leftFeedbackNode = new GainNode(context, { gain: 0 });
        this._rightFeedbackNode = new GainNode(context, { gain: 0 });

        this._leftDelayNode = new DelayNode(context, { delayTime: 0.3 });
        this._rightDelayNode = new DelayNode(context, { delayTime: 0.4 });

        const stereo = new ChannelMergerNode(context, { numberOfInputs: 2 });

        stereo.connect(output);

        this._leftDelayNode.connect(this._leftFeedbackNode);
        this._leftFeedbackNode.connect(this._leftDelayNode);
        this._leftDelayNode.connect(stereo, 0, 0);

        this._rightDelayNode.connect(this._rightFeedbackNode);
        this._rightFeedbackNode.connect(this._rightDelayNode);
        this._rightDelayNode.connect(stereo, 0, 1);
    }

    get leftInput() {
        return this._leftFeedbackNode;
    }

    get rightInput() {
        return this._rightFeedbackNode;
    }

    get leftGain() {
        return this._leftFeedbackNode.gain;
    }

    get rightGain() {
        return this._rightFeedbackNode.gain;
    }

    get leftDelay() {
        return this._leftDelayNode.delayTime;
    }

    get rightDelay() {
        return this._rightDelayNode.delayTime;
    }
}
