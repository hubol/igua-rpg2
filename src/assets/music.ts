import { MusicTrack } from "../lib/game-engine/audio/asshat-jukebox";
import { GeneratedMusicData } from "./generated/music/generated-music-data";

type MusicId = keyof typeof GeneratedMusicData;

export const Mzk: Record<MusicId, MusicTrack> = <any> {};

for (const key in GeneratedMusicData) {
    Mzk[key] = GeneratedMusicData[key].ogg;
}
