import { DisplayObject } from "pixi.js";
import { Sound, SoundInstance } from "../../lib/game-engine/audio/sound";
import { Null } from "../../lib/types/null";

export function mxnVoiceActed(obj: DisplayObject) {
    let previousVoiceSoundInstance = Null<SoundInstance>();

    const api = {
        play(voiceSfx: Sound) {
            previousVoiceSoundInstance?.stop();
            const soundInstance = obj.playInstance(voiceSfx);
            previousVoiceSoundInstance = soundInstance;
            return () => soundInstance.ended;
        },
        get isPlaying() {
            return previousVoiceSoundInstance ? !previousVoiceSoundInstance.ended : false;
        },
    };

    return obj
        .merge({ mxnVoiceActed: api })
        .on("removed", () => previousVoiceSoundInstance?.stop());
}
