import { DisplayObject } from "pixi.js";
import { MusicTrack } from "../../lib/game-engine/audio/asshat-jukebox";
import { onPrimitiveMutate } from "../../lib/game-engine/routines/on-primitive-mutate";
import { container } from "../../lib/pixi/container";
import { Jukebox } from "../core/igua-audio";

interface ObjBossMusicPlayerArgs {
    bossObjs: DisplayObject[];
    mzkPeace: MusicTrack;
    mzkBattle: MusicTrack;
}

export function objBossMusicPlayer(args: ObjBossMusicPlayerArgs) {
    const isEveryBossDestroyed = () => args.bossObjs.every(obj => obj.destroyed);
    return container()
        .coro(function* () {
            while (true) {
                Jukebox.play(isEveryBossDestroyed() ? args.mzkPeace : args.mzkBattle);
                yield onPrimitiveMutate(isEveryBossDestroyed);
            }
        });
}
