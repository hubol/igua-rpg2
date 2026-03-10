import { Integer } from "../../lib/math/number-alias-types";

export namespace RpgSaveFiles {
    export function check(): check.Model {
        return {
            lastLoadedIndex: null,
            saveFilesCount: 0,
        };
    }

    export namespace check {
        export interface Model {
            lastLoadedIndex: Integer | null;
            saveFilesCount: Integer;
        }
    }
}
