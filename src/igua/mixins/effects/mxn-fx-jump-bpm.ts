import { MusicTrack } from "../../../lib/game-engine/audio/asshat-jukebox";
import { Integer } from "../../../lib/math/number-alias-types";
import { mxnBpm } from "../mxn-bpm";
import { MxnPhysics } from "../mxn-physics";

export function mxnFxJumpBpm(obj: MxnPhysics, args: mxnFxJumpBpm.Args) {
    const api = {
        isJumping: true,
    };

    return obj
        .merge({ mxnFxJumpBpm: api })
        .mixin(mxnBpm, args)
        .coro(function* (self) {
            while (true) {
                yield () => self.isOnGround && self.speed.y >= 0 && api.isJumping;
                yield self.mxnBpm.onMeasureChange;
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
