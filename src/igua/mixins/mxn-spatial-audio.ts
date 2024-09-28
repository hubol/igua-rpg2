import { DisplayObject, Rectangle } from "pixi.js";
import { Sound } from "../../lib/game-engine/audio/sound";
import { IRectangle, areRectanglesOverlapping } from "../../lib/math/rectangle";
import { renderer } from "../globals";

const screenRectangle: IRectangle = { x: 0, y: 0, width: renderer.width, height: renderer.height };
const r = new Rectangle();

export function mxnSpatialAudio(obj: DisplayObject) {
    return obj.merge({
        play(sound: Sound) {
            // TODO should apply gain, panning based on obj position!!
            // TODO should it return an instance?
            if (areRectanglesOverlapping(obj.getBounds(true, r), screenRectangle)) {
                sound.play();
            }
        },
    });
}
