import { MusicTrack } from "../lib/game-engine/audio/asshat-jukebox";
import { GeneratedMusicData } from "./generated/music/generated-music-data";

export const Mzk: Record<Mzk.Id, MusicTrack> = <any> {};

export namespace Mzk {
    export type Id = keyof typeof GeneratedMusicData;
}

for (const key in GeneratedMusicData) {
    Mzk[key as Mzk.Id] = GeneratedMusicData[key as Mzk.Id].ogg;
}
