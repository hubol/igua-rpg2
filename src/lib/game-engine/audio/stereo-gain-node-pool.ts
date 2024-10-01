import { Logging } from "../../logging";
import { ErrorReporter } from "../error-reporter";

const MinPoolSize = 16;

export class StereoGainNodePool {
    private static readonly _pools = new Map<AudioNode, StereoGainNodePool>();
    private readonly _freeStereoGainNodes: StereoGainNode[] = [];

    private constructor(private readonly _destination: AudioNode) {
        console.log(...Logging.componentArgs("StereoGainNodePool", this));
    }

    private _getStereoGainNode() {
        if (this._freeStereoGainNodes.length) {
            return this._freeStereoGainNodes.shift()!;
        }

        return new StereoGainNode(this._destination);
    }

    private _returnToPool(node: StereoGainNode) {
        if (this._freeStereoGainNodes.length >= MinPoolSize) {
            node.dispose();
            return;
        }

        node.gain.value = 1;
        node.pan.value = 0;
        this._freeStereoGainNodes.push(node);
    }

    connectInput(source: AudioBufferSourceNode) {
        const node = this._getStereoGainNode();
        source.addEventListener("ended", () => this._returnToPool(node));
        node.setSource(source);
        return node;
    }

    static get(destination: AudioNode) {
        let pool = this._pools.get(destination);
        if (!pool) {
            pool = new StereoGainNodePool(destination);
            this._pools.set(destination, pool);
        }
        return pool;
    }
}

export class StereoGainNode {
    private _sourceNode: AudioBufferSourceNode | null = null;
    private _isDisposed = false;

    private readonly _gainNode: GainNode;
    private readonly _stereoPannerNode: StereoPannerNode;

    constructor(destination: AudioNode) {
        this._gainNode = new GainNode(destination.context);
        this._stereoPannerNode = new StereoPannerNode(destination.context);

        this._stereoPannerNode.connect(this._gainNode);
        this._gainNode.connect(destination);
    }

    setSource(sourceNode: AudioBufferSourceNode) {
        if (this._isDisposed) {
            ErrorReporter.reportDevOnlyState(
                new Error("Called StereoGainNodePair.setSource() when _isDisposed is true!"),
                { sourceNode },
            );
        }
        this._sourceNode?.disconnect();
        sourceNode.connect(this._stereoPannerNode);
        this._sourceNode = sourceNode;
    }

    dispose() {
        if (this._isDisposed) {
            return;
        }

        this._sourceNode?.disconnect();
        this._stereoPannerNode.disconnect();
        this._gainNode.disconnect();
        this._sourceNode = null;
        this._isDisposed = true;
    }

    get gain() {
        return this._gainNode.gain;
    }

    get pan() {
        return this._stereoPannerNode.pan;
    }
}
