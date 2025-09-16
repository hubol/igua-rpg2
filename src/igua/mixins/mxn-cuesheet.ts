import { DisplayObject } from "pixi.js";
import { MusicTrack } from "../../lib/game-engine/audio/asshat-jukebox";
import { Integer } from "../../lib/math/number-alias-types";
import { Jukebox } from "../core/igua-audio";
import { DataCuesheet } from "../data/data-cuesheet";

export function mxnCuesheet<T>(obj: DisplayObject, track: MusicTrack, cuesheet: DataCuesheet<T>) {
    const startedCueIndices = new Set<Integer>();
    let previousTime = Jukebox.getEstimatedPlayheadPosition(track);
    let minCueIndex = 0;

    return obj
        .dispatchesValue<"cue:start", T>()
        .dispatchesValue<"cue:end", T>()
        .step(self => {
            const time = Jukebox.getEstimatedPlayheadPosition(track);

            if (time < previousTime) {
                minCueIndex = 0;
                for (const cueIndex of startedCueIndices) {
                    self.dispatch("cue:end", cuesheet[cueIndex][2]);
                }
                startedCueIndices.clear();
            }
            else {
                previousTime = time;
            }

            for (let i = minCueIndex; i < cuesheet.length; i++) {
                const cue = cuesheet[i];
                const start = cue[0];
                const end = cue[1];
                const message = cue[2];

                if (time >= end) {
                    if (!startedCueIndices.has(i)) {
                        self.dispatch("cue:start", message);
                    }
                    self.dispatch("cue:end", message);
                    if (i === minCueIndex) {
                        minCueIndex++;
                    }
                }
                else if (time >= start) {
                    if (!startedCueIndices.has(i)) {
                        self.dispatch("cue:start", message);
                        startedCueIndices.add(i);
                    }
                }
                else {
                    break;
                }
            }
        });
}
