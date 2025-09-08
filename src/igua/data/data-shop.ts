import { Integer } from "../../lib/math/number-alias-types";
import { RpgEconomy } from "../rpg/rpg-economy";
import { DataEquipment } from "./data-equipment";
import { DataKeyItem } from "./data-key-item";
import { DataLib } from "./data-lib";
import { DataPotion } from "./data-potion";

export namespace DataShop {
    export interface Model {
        stocks: Stock[];
    }

    export const Manifest = DataLib.createManifest(
        {
            BalltownMechanicalIdol: {
                stocks: [{
                    product: { kind: "key_item", id: "UpgradedPickaxe" },
                    initialQuantity: 999,
                    price: { currency: "mechanical_idol_credits", deltaSold: 0, initial: 10 },
                }],
            },
            BalltownOutskirtsSecret: {
                stocks: [
                    {
                        product: { kind: "equipment", id: "JumpAtSpecialSignsRing" },
                        initialQuantity: 2,
                        price: { currency: "jump", initial: 250, deltaSold: 500 },
                    },
                    {
                        product: { kind: "equipment", id: "RichesRing" },
                        initialQuantity: 2,
                        price: { currency: "valuables", deltaSold: 800, initial: 200 },
                    },
                    {
                        product: { kind: "equipment", id: "YellowRichesRing" },
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
                        product: { kind: "equipment", id: "IqIndicator" },
                    },
                ],
            },
            SuggestiveSecret: {
                stocks: [
                    {
                        initialQuantity: 1,
                        price: { currency: "combat", deltaSold: 0, initial: 100 },
                        product: { kind: "equipment", id: "JumpAtSpecialSignsRing" },
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
                        price: { currency: "valuables", deltaSold: 100, initial: 100 },
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
            __Fallback__: { stocks: [] },
        } satisfies Record<string, Model>,
    );

    export const getById = DataLib.createGetById({ manifest: Manifest, namespace: "DataShop" });

    export type Id = keyof typeof Manifest;

    export interface Product_Equipment {
        kind: "equipment";
        id: DataEquipment.Id;
    }

    export interface Product_KeyItem {
        kind: "key_item";
        id: DataKeyItem.Id;
    }

    export interface Product_Potion {
        kind: "potion";
        id: DataPotion.Id;
    }

    // TODO can you buy pocket items?
    // probably...?
    // TODO can you buy flops?
    // not sure...?
    export type Product = Product_Equipment | Product_KeyItem | Product_Potion;

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
