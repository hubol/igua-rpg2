import { DisplayObject } from "pixi.js";
import { MusicTrack } from "../../lib/game-engine/audio/asshat-jukebox";
import { SoundInstance } from "../../lib/game-engine/audio/sound";
import { Integer } from "../../lib/math/number-alias-types";
import { Force } from "../../lib/types/force";
import { Jukebox } from "../core/igua-audio";
import { DataCuesheet } from "../data/data-cuesheet";

export function mxnCuesheet<TCommand>(
    obj: DisplayObject,
    soundInstance: MusicTrack | SoundInstance,
    cuesheet: DataCuesheet<TCommand>,
) {
    interface Message {
        command: TCommand;
        data: string | null;
    }

    const startedCueIndices = new Set<Integer>();
    const endedCueIndices = new Set<Integer>();

    const getPlayheadPosition = soundInstance instanceof SoundInstance
        ? () => soundInstance.estimatedPlayheadPosition
        : () => Jukebox.getEstimatedPlayheadPosition(soundInstance);

    let previousTime = getPlayheadPosition();
    let minCueIndex = 0;

    return obj
        .dispatchesValue<"cue:start", Message>()
        .dispatchesValue<"cue:end", Message>()
        .step(self => {
            const time = getPlayheadPosition();

            if (time < previousTime) {
                minCueIndex = 0;
                for (const cueIndex of startedCueIndices) {
                    if (endedCueIndices.has(cueIndex)) {
                        continue;
                    }
                    const cue = cuesheet[cueIndex];
                    const command = cue[2];
                    const data = cue[3];
                    self.dispatch("cue:end", { command, data });
                }
                startedCueIndices.clear();
                endedCueIndices.clear();
            }

            previousTime = time;

            let maxStart = Force<Integer>();

            for (let i = minCueIndex; i < cuesheet.length; i++) {
                const cue = cuesheet[i];
                const start = cue[0];
                const end = cue[1];
                const command = cue[2];
                const data = cue[3];

                if (i === minCueIndex) {
                    maxStart = end;
                }
                else {
                    maxStart = Math.max(maxStart, end);
                }

                if (start > maxStart) {
                    break;
                }

                if (time >= start || time >= end) {
                    if (!startedCueIndices.has(i)) {
                        self.dispatch("cue:start", { command, data });
                        startedCueIndices.add(i);
                    }
                }
                if (time >= end) {
                    if (!endedCueIndices.has(i)) {
                        self.dispatch("cue:end", { command, data });
                        endedCueIndices.add(i);
                    }

                    if (i === minCueIndex) {
                        minCueIndex++;
                    }
                }
            }
        });
}
