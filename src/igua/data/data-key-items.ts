import { DataLib } from "./data-lib";

export namespace DataKeyItem {
    export interface Model {
        name: string;
    }

    export const Manifest = DataLib.createManifest(
        {
            UpgradedPickaxe: { name: "MyPicaxe Version 2.0" },
            SeedYellow: { name: "Seed (Yellow)" },
            SeedGreen: { name: "Seed (Green)" },
            SeedBlue: { name: "Seed (Blue)" },
            SeedPurple: { name: "Seed (Purple)" },
            __Fallback__: { name: "???" },
        } satisfies Record<string, Model>,
    );

    export type Id = keyof typeof Manifest;

    export const getById = DataLib.createGetById({ manifest: Manifest, namespace: "DataKeyItem" });
}
