import { MusicTrack } from "../../../lib/game-engine/audio/asshat-jukebox";
import { onPrimitiveMutate } from "../../../lib/game-engine/routines/on-primitive-mutate";
import { Integer } from "../../../lib/math/number-alias-types";
import { Jukebox } from "../../core/igua-audio";
import { MxnPhysics } from "../mxn-physics";

export function mxnFxJumpBpm(obj: MxnPhysics, args: mxnFxJumpBpm.Args) {
    const seconds = (60 / args.bpm) / 2;
    const getMeasureIndex = () => Math.floor(Jukebox.getEstimatedPlayheadPosition(args.mzk) / seconds);

    const api = {
        isJumping: true,
    };

    return obj
        .merge({ mxnFxJumpBpm: api })
        .coro(function* (self) {
            while (true) {
                yield () => self.isOnGround && self.speed.y >= 0 && api.isJumping;
                yield onPrimitiveMutate(getMeasureIndex);
                self.speed.y = args.speed;
            }
        });
}

namespace mxnFxJumpBpm {
    export interface Args {
        mzk: MusicTrack;
        bpm: Integer;
        speed: number;
    }
}
