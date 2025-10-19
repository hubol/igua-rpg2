import { Integer } from "../../lib/math/number-alias-types";
import { RpgInventory } from "../rpg/rpg-inventory";
import { DataLib } from "./data-lib";

export namespace DataRewardPool {
    export type Item = RpgInventory.Item & { count?: Integer };

    namespace Model {
        export interface InOrder {
            kind: "in_order";
            items: Array<DataRewardPool.Item>;
            repeatItemOnEmpty: DataRewardPool.Item;
        }
    }

    export type Model = Model.InOrder;

    export const Manifest = DataLib.createManifest(
        {
            BeetGod: {
                kind: "in_order",
                items: [
                    { kind: "potion", id: "AttributeStrengthUp" },
                    { kind: "equipment", id: "NailFile", level: 1 },
                ],
                repeatItemOnEmpty: { kind: "key_item", id: "FlopBlindBox", count: 5 },
            },
            WheatGod: {
                kind: "in_order",
                items: [
                    { kind: "potion", id: "AttributeStrengthUp" },
                    { kind: "equipment", id: "PatheticCage", level: 1 },
                ],
                repeatItemOnEmpty: { kind: "key_item", id: "FlopBlindBox", count: 5 },
            },
            GreatTower: {
                kind: "in_order",
                items: [
                    { kind: "equipment", id: "DefensePhysicalAndPerfectBonus", level: 1 },
                    { kind: "equipment", id: "DefensePhysicalAndPerfectBonus", level: 2 },
                    { kind: "potion", id: "AttributeStrengthUp" },
                ],
                repeatItemOnEmpty: { kind: "potion", id: "RestoreHealth", count: 2 },
            },
            __Fallback__: {
                kind: "in_order",
                items: [],
                repeatItemOnEmpty: { kind: "potion", id: "RestoreHealth" },
            },
        } satisfies Record<string, Model>,
    );

    export type Id = keyof typeof Manifest;

    export const getById = DataLib.createGetById({ manifest: Manifest, namespace: "DataRewardPool" });
}
