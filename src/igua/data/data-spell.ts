import { Integer } from "../../lib/math/number-alias-types";
import { RpgAttack } from "../rpg/rpg-attack";
import { RpgFaction } from "../rpg/rpg-faction";
import { DataLib } from "./data-lib";

export namespace DataSpell {
    export type LevelRef = { level: Integer };

    export interface Model {
        name: string;
        attackProvider: (levelRef: LevelRef) => RpgAttack.Model;
    }

    export const Manifest = DataLib.createManifest(
        {
            HotPineCone: {
                name: "Hot Pine Cone",
                attackProvider: (ref) =>
                    RpgAttack.create({
                        versus: RpgFaction.Anyone,
                        conditions: {
                            overheat: {
                                get value() {
                                    return Math.floor((ref.level) / 3) + 1;
                                },
                                get damage() {
                                    return 30 + (ref.level - 1) * 20;
                                },
                            },
                        },
                    }),
            },
            __Fallback__: {
                name: "???",
                attackProvider: () => RpgAttack.create({}),
            },
        } satisfies Record<string, Model>,
    );

    export const getById = DataLib.createGetById({ manifest: Manifest, namespace: "DataSpell" });

    export type Id = DataLib.Id<keyof typeof Manifest>;

    export const Ids = DataLib.createIds(Manifest);
}
