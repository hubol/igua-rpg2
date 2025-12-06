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
                texture: Tx.Collectibles.Key.PickaxeUpgrade,
            },
            SeedYellow: {
                name: "Seed (Yellow)",
                description: "The seed of a lucrative idea.",
                texture: Tx.Collectibles.Key.SeedYellow,
            },
            SeedGreen: {
                name: "Seed (Green)",
                description: "The seed of a poisonous idea.",
                texture: Tx.Collectibles.Key.SeedGreen,
            },
            SeedBlue: {
                name: "Seed (Blue)",
                description: "The seed of a strong idea.",
                texture: Tx.Collectibles.Key.SeedBlue,
            },
            SeedPurple: {
                name: "Seed (Purple)",
                description: "The seed of a lucky idea.",
                texture: Tx.Collectibles.Key.SeedPurple,
            },
            FlopBlindBox: {
                name: "Blind Box (Flop)",
                description: "Only a professional collector should open this.",
                texture: Tx.Collectibles.Key.FlopBlindBox,
            },
            EquipmentGlue: {
                name: "Shoe Glue",
                description: "Used to increase the power of shoes.",
                texture: Tx.Collectibles.Key.EquipmentGlue,
            },
            UninflatedBallon: {
                name: "Uninflated Ballon",
                description: "In desperate need of helium.",
                texture: Tx.Collectibles.Key.UninflatedBallon,
            },
            TunnelGuyOrder: {
                name: "Sheeb's Order",
                description: "Delicious meal for Sheeb, the ancient tunnel maintainer.",
                texture: Tx.Collectibles.Key.SheebMeal,
            },
            RingerFish: {
                name: "Ding Ding Saudah's Fish",
                description: "Fish for Ding Ding Saudah, the eccentric in apartment 2.",
                texture: Tx.Collectibles.Key.DingDingFish,
            },
            __Fallback__: { name: "???", description: "If you are reading this, this is a bug.", texture: null },
        } satisfies Record<string, Model>,
    );

    export type Id = keyof typeof Manifest;

    export const getById = DataLib.createGetById({ manifest: Manifest, namespace: "DataKeyItem" });
}
