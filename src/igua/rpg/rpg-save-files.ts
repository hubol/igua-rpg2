import { StorageEntry } from "../../lib/browser/storage-entry";
import { Logger } from "../../lib/game-engine/logger";
import { Integer } from "../../lib/math/number-alias-types";
import { range } from "../../lib/range";
import { IguanaLooks } from "../iguana/looks";
import { SceneChanger } from "../systems/scene-changer";
import { Rpg, setRpgProgressData } from "./rpg";
import { RpgProgressData } from "./rpg-progress";

export namespace RpgSaveFiles {
    export const saveEvents = new Array<"success" | "error">();

    const lastOpenedIndexStorage = new StorageEntry.Local<Integer>("igua-rpg2-last-loaded-index");

    const saveFileLocalStorageEntries = range(3)
        .map(i => new StorageEntry.Local<RpgProgressData>("igua-rpg2-save-" + i));

    export namespace Current {
        let currentIndex = -1;

        export function open(index: Integer) {
            currentIndex = index;
            lastOpenedIndexStorage.value = index;
        }

        export function close() {
            currentIndex = -1;
        }

        export function load(index: Integer) {
            if (!saveFileLocalStorageEntries[index]) {
                throw new Error("Attempting to load save file outside of range [0-2]: " + index);
            }

            setRpgProgressData(saveFileLocalStorageEntries[index].readOrThrow());
            open(index);
            return SceneChanger.create(Rpg.character.position);
        }

        export function save() {
            if (!saveFileLocalStorageEntries[currentIndex]) {
                saveEvents.push("error");
                Logger.logUnexpectedError(
                    "RpgSaveFiles.Current",
                    new Error("Attempting to write save file outside of range [0-2]: " + currentIndex),
                );
                return;
            }

            try {
                Rpg.write(saveFileLocalStorageEntries[currentIndex]);
                saveEvents.push("success");
            }
            catch (e) {
                Logger.logUnexpectedError(
                    "RpgSaveFiles.Current",
                    e as Error,
                );
                saveEvents.push("error");
            }
        }
    }

    export function check(): check.Model {
        const saveFiles = saveFileLocalStorageEntries
            .map(entry => entry.value?.character?.looks ? { looks: entry.value.character.looks } : null);
        const lastLoadedIndex = lastOpenedIndexStorage.value!;
        return {
            lastLoadedIndex: saveFiles[lastLoadedIndex] ? lastLoadedIndex : null,
            saveFiles,
        };
    }

    export namespace check {
        export interface Model {
            lastLoadedIndex: Integer | null;
            saveFiles: ReadonlyArray<{ looks: IguanaLooks.Serializable } | null>;
        }
    }
}
