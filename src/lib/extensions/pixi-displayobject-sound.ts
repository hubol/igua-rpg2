import { DisplayObject, Rectangle } from "pixi.js";
import { Sound, SoundInstance } from "../game-engine/audio/sound";
import { EngineConfig } from "../game-engine/engine-config";
import { nlerp } from "../math/number";
import { areRectanglesOverlapping, IRectangle } from "../math/rectangle";

declare module "pixi.js" {
    interface DisplayObject {
        muted: boolean;
        play(sound: Sound): void;
        playInstance(sound: Sound): SoundInstance;
    }
}

interface DisplayObjectPrivate {
    _muted: boolean;
}

Object.defineProperties(DisplayObject.prototype, {
    muted: {
        get: function (this: DisplayObject & DisplayObjectPrivate) {
            return Boolean(this._muted);
        },
        set: function (this: DisplayObject & DisplayObjectPrivate, value: boolean) {
            this._muted = value;
        },
        configurable: true,
    },
    play: {
        value: function (this: DisplayObject & DisplayObjectPrivate, sound: Sound) {
            if (this._muted) {
                return;
            }

            if (applyDisplayObjectPositionToSound(this, sound)) {
                sound.play();
            }
        },
        configurable: true,
    },
    playInstance: {
        value: function (this: DisplayObject & DisplayObjectPrivate, sound: Sound) {
            const result = applyDisplayObjectPositionToSound(this, sound);
            if (this._muted || !result) {
                sound.gain(0);
            }
            return sound.playInstance();
        },
        configurable: true,
    },
});

const audibleRectangle: IRectangle = { x: 0, y: 0, width: 1, height: 1 };
const maximumGainRectangle: IRectangle = { x: 0, y: 0, width: 1, height: 1 };

function updateRendererRectangles() {
    const renderer = EngineConfig.renderer;

    audibleRectangle.x = -renderer.width / 2;
    audibleRectangle.y = -renderer.height / 2;
    audibleRectangle.width = renderer.width * 2;
    audibleRectangle.height = renderer.height * 2;

    maximumGainRectangle.x = 0;
    maximumGainRectangle.y = 0;
    maximumGainRectangle.width = renderer.width;
    maximumGainRectangle.height = renderer.height;
}

const objBoundsRectangle = new Rectangle();

function applyDisplayObjectPositionToSound(obj: DisplayObject, sound: Sound) {
    if (obj.destroyed) {
        // TODO might need to actually apply something in this case
        return false;
    }

    updateRendererRectangles();

    const bounds = obj.getBounds(false, objBoundsRectangle);
    if (areRectanglesOverlapping(bounds, audibleRectangle)) {
        const center = bounds.getCenter();
        sound.pan(Math.max(
            -0.9,
            Math.min(0.9, nlerp(-1, 1, (center.x - audibleRectangle.x) / audibleRectangle.width)),
        ));
        let gain = 1;
        if (center.x < maximumGainRectangle.x) {
            gain = Math.max(0.4, 1 - (center.x / audibleRectangle.x));
        }
        if (center.x > maximumGainRectangle.x + maximumGainRectangle.width) {
            gain = Math.max(0.4, 1 - ((center.x - maximumGainRectangle.width) / -audibleRectangle.x));
        }

        sound.gain(gain);
        return true;
    }

    return false;
}

export default 0;
