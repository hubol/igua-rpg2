import { DisplayObject, Rectangle } from "pixi.js";
import { Sound, SoundWith } from "../../lib/game-engine/audio/sound";
import { IRectangle, areRectanglesOverlapping } from "../../lib/math/rectangle";
import { renderer } from "../globals";
import { nlerp } from "../../lib/math/number";

const audibleRectangle: IRectangle = {
    x: -renderer.width / 2,
    y: -renderer.height / 2,
    width: renderer.width * 2,
    height: renderer.height * 2,
};
const maximumGainRectangle: IRectangle = {
    x: 0,
    y: 0,
    width: renderer.width,
    height: renderer.height,
};
const r = new Rectangle();

export function mxnSpatialAudio(obj: DisplayObject) {
    return obj.merge({
        play(sound: Sound | SoundWith) {
            const soundWith = "with" in sound ? sound.with : sound;
            // TODO should it return an instance?
            const bounds = obj.getBounds(true, r);
            if (areRectanglesOverlapping(obj.getBounds(true, r), audibleRectangle)) {
                const center = bounds.getCenter();
                soundWith.pan(Math.max(
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

                soundWith.gain(gain).play();
            }
        },
    });
}
