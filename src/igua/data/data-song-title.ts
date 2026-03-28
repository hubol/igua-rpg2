import { Mzk } from "../../assets/music";
import { MusicTrack } from "../../lib/game-engine/audio/asshat-jukebox";
import { Logger } from "../../lib/game-engine/logger";
import { StringTransform } from "../../lib/string/string-transform";

export namespace DataSongTitle {
    const fallback = getModel("UnknownSong" as any);

    export const Manifest: Record<MusicTrack, Model> = {
        ...Object.fromEntries(Object.entries(Mzk).map(([id, track]) => [track, getModel(id as Mzk.Id)])),
        [Mzk.Covid19]: {
            firstWord: "COVID",
            remainingWords: "-19",
            title: "COVID-19",
        },
    };

    export function getByMusicTrack(track: MusicTrack) {
        if (Manifest[track]) {
            return Manifest[track];
        }
        Logger.logContractViolationError(
            "DataSongTitle.getByMusicTrack",
            new Error("specified track is not in manifest"),
            { track },
        );
        return fallback;
    }

    export interface Model {
        title: string;
        firstWord: string;
        remainingWords: string;
    }

    function getModel(id: Mzk.Id): Model {
        const words = StringTransform.toEnglishWords(id);
        const [firstWord, ...remainingWords] = words;
        return {
            firstWord,
            remainingWords: remainingWords.join(" "),
            title: words.join(" "),
        };
    }
}
