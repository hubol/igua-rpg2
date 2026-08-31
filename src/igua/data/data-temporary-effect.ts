import { RpgPlayerBuffs } from "../rpg/rpg-player-buffs";
import { DataLib } from "./data-lib";

export namespace DataTemporaryEffect {
    export interface Model {
        hudText: string;
        buffs: RpgPlayerBuffs.MutatorFn;
    }

    export const { getById, manifest } = DataLib.create(
        "DataTemporaryEffect",
        {
            IntelligenceFromLibraryBook: {
                hudText: "Library book makes you feel smarter",
                buffs: (model) => {
                    model.attributes.intelligence += 1;
                },
            },
            __Fallback__: {
                hudText: "This is a bug",
                buffs: () => {},
            },
        } satisfies Record<string, Model>,
    );

    export type Id = DataLib.Id<typeof manifest>;
}
