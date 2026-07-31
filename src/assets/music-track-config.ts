import { MusicTrack } from "../lib/game-engine/audio/asshat-jukebox";
import { Seconds } from "../lib/math/number-alias-types";
import { Mzk } from "./music";

export namespace MusicTrackConfig {
    interface Model {
        loopStart: Seconds;
        loopEnd: Seconds;
    }

    const defaultValue: Model = {
        loopStart: 0,
        loopEnd: 0,
    };

    export const get = (function configure (mzkIdLoopStartSeconds: Partial<Record<Mzk.Id, Model>>) {
        const musicTrackLoopStartSeconds = Object.fromEntries(
            Object.entries(mzkIdLoopStartSeconds)
                .map(([mzkId, seconds]) => [Mzk[mzkId as Mzk.Id], seconds]),
        );

        return (musicTrack: MusicTrack) =>
            musicTrack in musicTrackLoopStartSeconds
                ? musicTrackLoopStartSeconds[musicTrack]
                : defaultValue;
    })({
        BogusWorld: {
            loopStart: .6894,
            loopEnd: 44.8275,
        },
    });
}
