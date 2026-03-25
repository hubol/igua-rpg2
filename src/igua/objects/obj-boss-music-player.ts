import { DisplayObject } from "pixi.js";
import { MusicTrack } from "../../lib/game-engine/audio/asshat-jukebox";
import { onPrimitiveMutate } from "../../lib/game-engine/routines/on-primitive-mutate";
import { container } from "../../lib/pixi/container";
import { Jukebox } from "../core/igua-audio";
import { mxnDetectPlayer } from "../mixins/mxn-detect-player";

interface ObjBossMusicPlayerArgs {
    bossObjs: DisplayObject[];
    mzkPeace: MusicTrack;
    mzkBattle: MusicTrack;
}

export function objBossMusicPlayer(args: ObjBossMusicPlayerArgs) {
    function isAnyBossAliveAndDetectedPlayer() {
        for (const obj of args.bossObjs) {
            if (!obj.destroyed) {
                if (!obj.is(mxnDetectPlayer)) {
                    return true;
                }
                if (obj.mxnDetectPlayer.detectionScore > -600) {
                    return true;
                }
            }
        }

        return false;
    }

    return container()
        .coro(function* () {
            while (true) {
                const isBattle = isAnyBossAliveAndDetectedPlayer();
                Jukebox.play(isBattle ? args.mzkBattle : args.mzkPeace, isBattle ? 250 : 1000);
                yield onPrimitiveMutate(isAnyBossAliveAndDetectedPlayer);
            }
        });
}
