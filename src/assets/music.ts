import { GeneratedMusicData } from "./generated/music/generated-music-data";

type MusicId = keyof typeof GeneratedMusicData;

export const Mzk: Record<MusicId, string> = <any>{};

for (const key in GeneratedMusicData)
    Mzk[key] = GeneratedMusicData[key].ogg;