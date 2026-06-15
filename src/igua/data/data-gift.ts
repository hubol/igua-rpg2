import { RpgInventory } from "../rpg/rpg-inventory";
import { DataLib } from "./data-lib";

export namespace DataGift {
    export type Model = { item: RpgInventory.Item };

    export const { manifest, getById } = DataLib.create(
        "DataGift",
        {
            "NewBalltown.OliveFanatic": {
                item: { kind: "potion", id: "AttributeHealthUp" },
            },
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
            "Demo.GoodEnd": {
                item: { kind: "equipment", id: "Sparkle", level: 1 },
            },
            "Indiana.DarkEvilHole.Illuminate": {
                item: { kind: "equipment", id: "NightVision", level: 1 },
            },
            "Indiana.MagicDoor.0": {
                item: { kind: "equipment", id: "BlueCrystalSock", level: 1 },
            },
            "Indiana.MagicDoor.1": {
                item: { kind: "equipment", id: "BlueCrystalSock", level: 1 },
            },
            "Indiana.MagicDoor.2": {
                item: { kind: "equipment", id: "BlueCrystalSock", level: 1 },
            },
            "Indiana.MagicDoor.3": {
                item: { kind: "equipment", id: "BlueCrystalSock", level: 1 },
            },
            "Indiana.Hall.Painting.Honesty": {
                item: { kind: "potion", id: "AttributeHealthUp" },
            },
            "MountFlop.Flower": {
                item: { kind: "equipment", id: "SpellOpenFlopBlindBoxes", level: 1 },
            },
            "Ohio.Market.Flip": {
                item: { kind: "potion", id: "HotDogKetchupMustardOnionRelish" },
            },
            __Fallback__: {
                item: { kind: "potion", id: "RestoreHealth" },
            },
        } satisfies Record<string, Model>,
    );

    export type Id = DataLib.Id<typeof manifest>;
}
