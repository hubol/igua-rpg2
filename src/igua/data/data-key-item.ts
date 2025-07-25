import { DataLib } from "./data-lib";

export namespace DataKeyItem {
    export interface Model {
        name: string;
        description: string;
    }

    export const Manifest = DataLib.createManifest(
        {
            BagOfSeeds: {
                name: "Seed Bag",
                description: "A magical bag with the power to annihilate the ballfruit economy.",
            },
            UpgradedPickaxe: { name: "MyPicaxe Version 2.0", description: "A miner would benefit from this" },
            SeedYellow: { name: "Seed (Yellow)", description: "The seed of a lucrative idea." },
            SeedGreen: { name: "Seed (Green)", description: "The seed of a poisonous idea." },
            SeedBlue: { name: "Seed (Blue)", description: "The seed of a strong idea." },
            SeedPurple: { name: "Seed (Purple)", description: "The seed of a lucky idea." },
            __Fallback__: { name: "???", description: "If you are reading this, this is a bug." },
        } satisfies Record<string, Model>,
    );

    export type Id = keyof typeof Manifest;

    export const getById = DataLib.createGetById({ manifest: Manifest, namespace: "DataKeyItem" });
}
