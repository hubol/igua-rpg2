import { Integer } from "../../lib/math/number-alias-types";
import { IguanaLooks } from "../iguana/looks";

export namespace RpgSaveFiles {
    export function check(): check.Model {
        return {
            lastLoaded: null,
            saveFilesCount: 0,
        };
    }

    export namespace check {
        export interface Model {
            lastLoaded: {
                index: Integer;
                looks: IguanaLooks.Serializable;
            } | null;
            saveFilesCount: Integer;
        }
    }
}
