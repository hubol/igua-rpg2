import { DisplayObject } from "pixi.js";
import { Sound, SoundInstance } from "../../lib/game-engine/audio/sound";

export function mxnSoundLoop(obj: DisplayObject) {
    const soundInstances = new Array<SoundInstance>();

    const api = {
        playInstance(sound: Sound) {
            const soundInstance = sound.loop().playInstance();
            soundInstances.push(soundInstance);
            return soundInstance;
        },
    };

    return obj
        .merge({ mxnSoundLoop: api })
        .on("removed", () => soundInstances.forEach(instance => instance.stop()));
}
