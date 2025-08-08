import { Texture } from "pixi.js";
import { Tx } from "../../assets/textures";
import { DataLib } from "./data-lib";

export namespace DataKeyItem {
    export interface Model {
        name: string;
        description: string;
        texture: Texture | null;
    }

    export const Manifest = DataLib.createManifest(
        {
            BagOfSeeds: {
                name: "Seed Bag",
                description: "A magical bag with the power to annihilate the ballfruit economy.",
                texture: Tx.Collectibles.Key.SeedBag,
            },
            UpgradedPickaxe: {
                name: "MyPicaxe Version 2.0",
                description: "A miner would benefit from this",
                texture: null,
            },
            SeedYellow: { name: "Seed (Yellow)", description: "The seed of a lucrative idea.", texture: null },
            SeedGreen: { name: "Seed (Green)", description: "The seed of a poisonous idea.", texture: null },
            SeedBlue: { name: "Seed (Blue)", description: "The seed of a strong idea.", texture: null },
            SeedPurple: { name: "Seed (Purple)", description: "The seed of a lucky idea.", texture: null },
            __Fallback__: { name: "???", description: "If you are reading this, this is a bug.", texture: null },
        } satisfies Record<string, Model>,
    );

    export type Id = keyof typeof Manifest;

    export const getById = DataLib.createGetById({ manifest: Manifest, namespace: "DataKeyItem" });
}
