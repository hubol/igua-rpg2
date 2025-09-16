import { DisplayObject } from "pixi.js";
import { MusicTrack } from "../../lib/game-engine/audio/asshat-jukebox";
import { Integer } from "../../lib/math/number-alias-types";
import { Jukebox } from "../core/igua-audio";
import { DataCuesheet } from "../data/data-cuesheet";

export function mxnCuesheet<TCommand>(obj: DisplayObject, track: MusicTrack, cuesheet: DataCuesheet<TCommand>) {
    interface Message {
        command: TCommand;
        data: string | null;
    }

    const startedCueIndices = new Set<Integer>();
    let previousTime = Jukebox.getEstimatedPlayheadPosition(track);
    let minCueIndex = 0;

    return obj
        .dispatchesValue<"cue:start", Message>()
        .dispatchesValue<"cue:end", Message>()
        .step(self => {
            const time = Jukebox.getEstimatedPlayheadPosition(track);

            if (time < previousTime) {
                minCueIndex = 0;
                for (const cueIndex of startedCueIndices) {
                    const cue = cuesheet[cueIndex];
                    const command = cue[2];
                    const data = cue[3];
                    self.dispatch("cue:end", { command, data });
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
                const command = cue[2];
                const data = cue[3];

                if (time >= end) {
                    if (!startedCueIndices.has(i)) {
                        self.dispatch("cue:start", { command, data });
                    }
                    self.dispatch("cue:end", { command, data });
                    if (i === minCueIndex) {
                        minCueIndex++;
                    }
                }
                else if (time >= start) {
                    if (!startedCueIndices.has(i)) {
                        self.dispatch("cue:start", { command, data });
                        startedCueIndices.add(i);
                    }
                }
                else {
                    break;
                }
            }
        });
}
