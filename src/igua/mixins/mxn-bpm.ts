import { DisplayObject } from "pixi.js";
import { MusicTrack } from "../../lib/game-engine/audio/asshat-jukebox";
import { onPrimitiveMutate } from "../../lib/game-engine/routines/on-primitive-mutate";
import { Integer } from "../../lib/math/number-alias-types";
import { Jukebox } from "../core/igua-audio";

export function mxnBpm(obj: DisplayObject, args: mxnBpm.Args) {
    const seconds = (60 / args.bpm) / 2;
    const getMeasureIndex = () => Math.floor(Jukebox.getEstimatedPlayheadPosition(args.mzk) / seconds);

    const api = {
        get onMeasureChange() {
            return onPrimitiveMutate(getMeasureIndex);
        },
    };

    return obj
        .merge({ mxnBpm: api });
}

namespace mxnBpm {
    export interface Args {
        mzk: MusicTrack;
        bpm: Integer;
    }
}
