import { RpgPlayerBuffs } from "../rpg/rpg-player-buffs";
import { DataLib } from "./data-lib";

export namespace DataTemporaryEffect {
    export interface Model {
        name: string;
        buffs: RpgPlayerBuffs.MutatorFn;
    }

    export const { getById, manifest } = DataLib.create(
        "DataTemporaryEffect",
        {
            IntelligenceFromLibraryBook: {
                name: "Library book makes you feel smarter",
                buffs: (model) => {
                    model.attributes.intelligence += 1;
                },
            },
            __Fallback__: {
                name: "This is a bug",
                buffs: () => {},
            },
        } satisfies Record<string, Model>,
    );

    export type Id = DataLib.Id<typeof manifest>;
}
