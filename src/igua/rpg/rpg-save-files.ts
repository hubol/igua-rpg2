import { StorageEntry } from "../../lib/browser/storage-entry";
import { Logger } from "../../lib/game-engine/logger";
import { Integer } from "../../lib/math/number-alias-types";
import { range } from "../../lib/range";
import { IguanaLooks } from "../iguana/looks";
import { SceneChanger } from "../systems/scene-changer";
import { Rpg, setRpgProgressData } from "./rpg";
import { RpgProgressData } from "./rpg-progress";

export namespace RpgSaveFiles {
    const saveFileLocalStorageEntries = range(3)
        .map(i => new StorageEntry.Local<RpgProgressData>("igua-rpg2-save-" + i));

    export namespace Current {
        let currentIndex = -1;

        export function open(index: Integer) {
            currentIndex = index;
        }

        export function close() {
            currentIndex = -1;
        }

        export function load(index: Integer) {
            if (!saveFileLocalStorageEntries[index]) {
                throw new Error("Attempting to load save file outside of range [0-2]: " + index);
            }

            setRpgProgressData(saveFileLocalStorageEntries[index].readOrThrow());
            currentIndex = index;
            // TODO record last loaded index
            return SceneChanger.create(Rpg.character.position);
        }

        export function save() {
            if (!saveFileLocalStorageEntries[currentIndex]) {
                Logger.logUnexpectedError(
                    "RpgSaveFiles.Current",
                    new Error("Attempting to write save file outside of range [0-2]: " + currentIndex),
                );
                return;
            }

            Rpg.write(saveFileLocalStorageEntries[currentIndex]);
            // TODO increment some counter for UI to spy on?
        }
    }

    export function check(): check.Model {
        return {
            lastLoadedIndex: null,
            saveFiles: saveFileLocalStorageEntries.map(entry =>
                entry.value?.character?.looks ? { looks: entry.value.character.looks } : null
            ),
        };
    }

    export namespace check {
        export interface Model {
            lastLoadedIndex: Integer | null;
            saveFiles: ReadonlyArray<{ looks: IguanaLooks.Serializable } | null>;
        }
    }
}
