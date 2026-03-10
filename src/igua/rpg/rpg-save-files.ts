import { Integer } from "../../lib/math/number-alias-types";
import { NpcLooks } from "../data/data-npc-looks";
import { IguanaLooks } from "../iguana/looks";

export namespace RpgSaveFiles {
    export function check(): check.Model {
        return {
            lastLoadedIndex: null,
            saveFiles: [
                { looks: NpcLooks.AustraliasOwnBluey },
            ],
        };
    }

    export namespace check {
        export interface Model {
            lastLoadedIndex: Integer | null;
            saveFiles: ReadonlyArray<{ looks: IguanaLooks.Serializable } | null>;
        }
    }
}
