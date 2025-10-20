import { Integer } from "../../lib/math/number-alias-types";
import { RpgInventory } from "../rpg/rpg-inventory";
import { DataLib } from "./data-lib";

export namespace DataRewardPool {
    export type Item = (RpgInventory.Item | { kind: "currency"; id: "valuables" }) & { count?: Integer };

    namespace Extend {
        export interface Repeat {
            kind: "repeat";
            item: DataRewardPool.Item;
        }
    }

    type Extend = Extend.Repeat | null;

    namespace Model {
        export interface InOrder {
            kind: "in_order";
            items: Array<DataRewardPool.Item>;
        }
    }

    export type Model = Model.InOrder & { extend: Extend };

    export const Manifest = DataLib.createManifest(
        {
            BeetGod: {
                kind: "in_order",
                items: [
                    { kind: "potion", id: "AttributeStrengthUp" },
                    { kind: "equipment", id: "NailFile", level: 1 },
                ],
                extend: {
                    kind: "repeat",
                    item: { kind: "key_item", id: "FlopBlindBox", count: 5 },
                },
            },
            WheatGod: {
                kind: "in_order",
                items: [
                    { kind: "potion", id: "AttributeStrengthUp" },
                    { kind: "equipment", id: "PatheticCage", level: 1 },
                ],
                extend: {
                    kind: "repeat",
                    item: { kind: "key_item", id: "FlopBlindBox", count: 5 },
                },
            },
            GreatTower: {
                kind: "in_order",
                items: [
                    { kind: "equipment", id: "DefensePhysicalAndPerfectBonus", level: 1 },
                    { kind: "equipment", id: "DefensePhysicalAndPerfectBonus", level: 2 },
                    { kind: "potion", id: "AttributeStrengthUp" },
                ],
                extend: {
                    kind: "repeat",
                    item: { kind: "potion", id: "RestoreHealth", count: 2 },
                },
            },
            __Fallback__: {
                kind: "in_order",
                items: [],
                extend: null,
            },
        } satisfies Record<string, Model>,
    );

    export type Id = keyof typeof Manifest;

    export const getById = DataLib.createGetById({ manifest: Manifest, namespace: "DataRewardPool" });
}
