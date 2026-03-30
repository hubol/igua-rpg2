import { RpgInventory } from "../rpg/rpg-inventory";
import { DataLib } from "./data-lib";

export namespace DataGift {
    export type Model = { item: RpgInventory.Item };

    export const Manifest = DataLib.createManifest(
        {
            "StrangeMarket.GreeterShoe": {
                item: { kind: "equipment", id: "PoisonRing", level: 1 },
            },
            "GreatTower.EfficientHome.Musician.SongShoe": {
                item: { kind: "equipment", id: "RecognizeSong", level: 1 },
            },
            "Demo.MagicDoor.0": {
                item: { kind: "equipment", id: "DoubleJump", level: 1 },
            },
            "Demo.MagicDoor.1": {
                item: { kind: "equipment", id: "DoubleJump", level: 1 },
            },
            "Demo.MagicDoor.2": {
                item: { kind: "equipment", id: "DoubleJump", level: 1 },
            },
            "Demo.MagicDoor.3": {
                item: { kind: "equipment", id: "DoubleJump", level: 1 },
            },
            __Fallback__: {
                item: { kind: "potion", id: "RestoreHealth" },
            },
        } satisfies Record<string, Model>,
    );

    export const getById = DataLib.createGetById({ manifest: Manifest, namespace: "DataGift" });

    export type Id = keyof typeof Manifest;
}
