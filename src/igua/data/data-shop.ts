import { Integer } from "../../lib/math/number-alias-types";
import { RpgEconomy } from "../rpg/rpg-economy";
import { RpgInventory } from "../rpg/rpg-inventory";
import { DataLib } from "./data-lib";

export namespace DataShop {
    export interface Model {
        stocks: Stock[];
    }

    export const Manifest = DataLib.createManifest(
        {
            BalltownMechanicalIdol: {
                stocks: [
                    {
                        product: { kind: "key_item", id: "UpgradedPickaxe" },
                        initialQuantity: 999,
                        price: { currency: "mechanical_idol_credits", deltaSold: 0, initial: 10 },
                    },
                    {
                        product: { kind: "potion", id: "AttributeHealthUp" },
                        initialQuantity: 1,
                        price: { currency: "mechanical_idol_credits", deltaSold: 0, initial: 10 },
                    },
                    {
                        product: { kind: "potion", id: "AttributeStrengthUp" },
                        initialQuantity: 1,
                        price: { currency: "mechanical_idol_credits", deltaSold: 0, initial: 15 },
                    },
                ],
            },
            BalltownOutskirtsSecret: {
                stocks: [
                    {
                        product: { kind: "equipment", id: "JumpAtSpecialSignsRing", level: 1 },
                        initialQuantity: 2,
                        price: { currency: "jump", initial: 250, deltaSold: 500 },
                    },
                    {
                        product: { kind: "equipment", id: "RichesRing", level: 1 },
                        initialQuantity: 2,
                        price: { currency: "valuables", deltaSold: 800, initial: 200 },
                    },
                    {
                        product: { kind: "equipment", id: "YellowRichesRing", level: 1 },
                        initialQuantity: 2,
                        price: { currency: "combat", deltaSold: 750, initial: 250 },
                    },
                ],
            },
            UnderneathHomeowner: {
                stocks: [
                    {
                        initialQuantity: 99,
                        price: { currency: "valuables", deltaSold: 1, initial: 5 },
                        product: { kind: "key_item", id: "SeedYellow" },
                    },
                    {
                        initialQuantity: 99,
                        price: { currency: "valuables", deltaSold: 1, initial: 5 },
                        product: { kind: "key_item", id: "SeedGreen" },
                    },
                    {
                        initialQuantity: 99,
                        price: { currency: "valuables", deltaSold: 1, initial: 5 },
                        product: { kind: "key_item", id: "SeedBlue" },
                    },
                    {
                        initialQuantity: 99,
                        price: { currency: "valuables", deltaSold: 1, initial: 5 },
                        product: { kind: "key_item", id: "SeedPurple" },
                    },
                    // TODO not sure if restore poison should appear in the art store
                    // maybe he has two stores instead
                    {
                        initialQuantity: 99,
                        price: { currency: "valuables", deltaSold: 25, initial: 15 },
                        product: { kind: "potion", id: "PoisonRestore" },
                    },
                ],
            },
            SuggestiveCavern: {
                stocks: [
                    {
                        initialQuantity: 1,
                        price: { currency: "valuables", deltaSold: 0, initial: 999 },
                        product: { kind: "key_item", id: "BagOfSeeds" },
                    },
                    {
                        initialQuantity: 3,
                        price: { currency: "jump", initial: 100, deltaSold: 300 },
                        product: { kind: "equipment", id: "IqIndicator", level: 1 },
                    },
                ],
            },
            SuggestiveSecret: {
                stocks: [
                    {
                        initialQuantity: 1,
                        price: { currency: "combat", deltaSold: 0, initial: 100 },
                        product: { kind: "equipment", id: "JumpAtSpecialSignsRing", level: 1 },
                    },
                    {
                        initialQuantity: 5,
                        price: { currency: "valuables", deltaSold: 0, initial: 10 },
                        product: { kind: "key_item", id: "FlopBlindBox" },
                    },
                ],
            },
            Gluemaker: {
                stocks: [
                    {
                        initialQuantity: 10,
                        price: { currency: "pocket", deltaSold: 50, initial: 50 },
                        product: { kind: "key_item", id: "EquipmentGlue" },
                    },
                    {
                        initialQuantity: 10,
                        price: { currency: "jump", deltaSold: 400, initial: 100 },
                        product: { kind: "key_item", id: "EquipmentGlue" },
                    },
                    {
                        initialQuantity: 10,
                        price: { currency: "gambling", deltaSold: 130, initial: 100 },
                        product: { kind: "key_item", id: "EquipmentGlue" },
                    },
                ],
            },
            GreatTower: {
                stocks: [
                    {
                        initialQuantity: 99,
                        price: { currency: "valuables", deltaSold: 2, initial: 10 },
                        product: { kind: "key_item", id: "UninflatedBallon" },
                    },
                    {
                        initialQuantity: 2,
                        price: { currency: "jump", deltaSold: 500, initial: 500 },
                        product: { kind: "equipment", id: "BallonLastLonger", level: 1 },
                    },
                ],
            },
            __Fallback__: { stocks: [] },
        } satisfies Record<string, Model>,
    );

    export const getById = DataLib.createGetById({ manifest: Manifest, namespace: "DataShop" });

    export type Id = keyof typeof Manifest;

    // TODO can you buy pocket items?
    // probably...?
    // TODO can you buy flops?
    // not sure...?
    export type Product = Product.Equipment | Product.KeyItem | Product.Potion;

    export namespace Product {
        export type Equipment = RpgInventory.Item.Equipment;
        export type KeyItem = RpgInventory.Item.KeyItem;
        export type Potion = RpgInventory.Item.Potion;
    }

    export interface Price {
        currency: RpgEconomy.Currency.Id;
        initial: Integer;
        deltaSold: Integer;
    }

    export interface Stock {
        product: Product;
        initialQuantity: Integer;
        price: Price;
    }
}
