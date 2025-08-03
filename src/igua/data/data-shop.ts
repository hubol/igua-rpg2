import { Integer } from "../../lib/math/number-alias-types";
import { RpgEconomy } from "../rpg/rpg-economy";
import { DataEquipment } from "./data-equipment";
import { DataKeyItem } from "./data-key-item";
import { DataLib } from "./data-lib";

export namespace DataShop {
    export interface Model {
        stocks: Stock[];
    }

    export const Manifest = DataLib.createManifest(
        {
            BalltownMechanicalIdol: {
                stocks: [{
                    product: { kind: "key_item", keyItemId: "UpgradedPickaxe" },
                    initialQuantity: 999,
                    price: { currency: "mechanical_idol_credits", deltaSold: 0, initial: 10 },
                }],
            },
            BalltownOutskirtsSecret: {
                stocks: [
                    {
                        product: { kind: "equipment", equipmentId: "JumpAtSpecialSignsRing" },
                        initialQuantity: 2,
                        price: { currency: { kind: "experience", experience: "jump" }, initial: 250, deltaSold: 500 },
                    },
                    {
                        product: { kind: "equipment", equipmentId: "RichesRing" },
                        initialQuantity: 2,
                        price: { currency: "valuables", deltaSold: 800, initial: 200 },
                    },
                    {
                        product: { kind: "equipment", equipmentId: "YellowRichesRing" },
                        initialQuantity: 2,
                        price: { currency: { experience: "combat", kind: "experience" }, deltaSold: 750, initial: 250 },
                    },
                ],
            },
            UnderneathHomeowner: {
                stocks: [
                    {
                        initialQuantity: 99,
                        price: { currency: "valuables", deltaSold: 1, initial: 5 },
                        product: { kind: "key_item", keyItemId: "SeedYellow" },
                    },
                    {
                        initialQuantity: 99,
                        price: { currency: "valuables", deltaSold: 1, initial: 5 },
                        product: { kind: "key_item", keyItemId: "SeedGreen" },
                    },
                    {
                        initialQuantity: 99,
                        price: { currency: "valuables", deltaSold: 1, initial: 5 },
                        product: { kind: "key_item", keyItemId: "SeedBlue" },
                    },
                    {
                        initialQuantity: 99,
                        price: { currency: "valuables", deltaSold: 1, initial: 5 },
                        product: { kind: "key_item", keyItemId: "SeedPurple" },
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
        equipmentId: DataEquipment.Id;
    }

    export interface Product_KeyItem {
        kind: "key_item";
        keyItemId: DataKeyItem.Id;
    }

    export interface Product_Potion {
        kind: "potion";
    }

    // TODO can you buy pocket items?
    // probably...?
    // TODO can you buy flops?
    // not sure...?
    export type Product = Product_Equipment | Product_KeyItem | Product_Potion;

    export interface Price {
        currency: RpgEconomy.Currency.Model;
        initial: Integer;
        deltaSold: Integer;
    }

    export interface Stock {
        product: Product;
        initialQuantity: Integer;
        price: Price;
    }
}
