import { Texture } from "pixi.js";
import { Tx } from "../../assets/textures";
import { RgbInt } from "../../lib/math/number-alias-types";
import { playerObj } from "../objects/obj-player";
import { Rpg } from "../rpg/rpg";
import { RpgAttack } from "../rpg/rpg-attack";
import { DataLib } from "./data-lib";

export namespace DataPotion {
    export interface Model {
        name: string;
        description: string;
        stinkLineTint: RgbInt;
        texture: Texture | null;
    }

    export const Manifest = DataLib.createManifest(
        {
            AttributeHealthUp: {
                name: "Spiced Nectar",
                description: "Delicious nectar. Increases maximum HP.",
                stinkLineTint: 0x004AFF,
                texture: Tx.Collectibles.Potion.AttributeHealthUp,
            },
            AttributeIntelligenceUp: {
                name: "Foul Stew",
                description: "Challenging, odiforous soup. Increases intelligence.",
                stinkLineTint: 0xCEA5AA,
                texture: Tx.Collectibles.Potion.AttributeIntelligenceUp,
            },
            AttributeStrengthUp: {
                name: "Claw Powder",
                description: "Fine grit for sharpening claws. Increases physical attack power.",
                stinkLineTint: 0xB6B2FF,
                texture: Tx.Collectibles.Potion.AttributeStrengthUp,
            },
            RestoreHealth: {
                name: "Sweet Berry",
                description: "Pungent fruit. Recover some health.",
                stinkLineTint: 0xD882D1,
                texture: Tx.Collectibles.Potion.RestoreHealth,
            },
            RestoreHealthRestaurantLevel0: {
                name: "Pathetic Meal",
                description: "Meal for a cheapskate. Recover negligible health.",
                stinkLineTint: 0xD882D1,
                texture: null,
            },
            RestoreHealthRestaurantLevel1: {
                name: "Unremarkable Meal",
                description: "Average meal. Recover some health.",
                stinkLineTint: 0xD882D1,
                texture: null,
            },
            RestoreHealthRestaurantLevel2: {
                name: "Celebratory Meal",
                description: "Oversized meal. Recover substantial health.",
                stinkLineTint: 0xD882D1,
                texture: null,
            },
            Poison: {
                name: "Poison",
                description: "Popular in most communities. Become poisoned.",
                stinkLineTint: 0xA53609,
                texture: Tx.Collectibles.Potion.Poison,
            },
            PoisonRestore: {
                name: "Bitter Medicine",
                description: "Expensive capsule. Recover from poison.",
                stinkLineTint: 0x7A42FF,
                texture: Tx.Collectibles.Potion.PoisonRestore,
            },
            Ballon: {
                name: "Ballon Fruit",
                description: "Naturally-occurring and filled with helium. What?",
                stinkLineTint: 0xE1282C,
                texture: Tx.Collectibles.Potion.Ballon,
            },
            Wetness: {
                name: "TheWetter",
                description: "Celebrated beverage. Become drenched.",
                stinkLineTint: 0x2149FF,
                texture: Tx.Collectibles.Potion.Wetness,
            },
            ForgetLooseValuableCollection: {
                name: "Forgeddit",
                description: "Renowned charm. Loose valuables forgive your transgressions.",
                stinkLineTint: 0x808080,
                texture: null,
            },
            __Fallback__: {
                name: "???",
                description: "Consume to experience a bug",
                stinkLineTint: 0xff00ff,
                texture: null,
            },
        } satisfies Record<string, Model>,
    );

    export type Id = keyof typeof Manifest;

    export const getById = DataLib.createGetById({ manifest: Manifest, namespace: "DataPotion" });

    // TODO The colocation is good. But there are many strange things going on here, haha
    export function usePotion(id: Id) {
        switch (id) {
            case "AttributeHealthUp":
                const previousHealthMax = Rpg.character.status.healthMax;
                Rpg.character.attributes.update("health", 1);
                playerObj.heal(Math.round(Rpg.character.status.healthMax - previousHealthMax));
                return;
            case "AttributeIntelligenceUp":
                Rpg.character.attributes.update("intelligence", 1);
                return;
            case "AttributeStrengthUp":
                Rpg.character.attributes.update("strength", 1);
                return;
            case "RestoreHealthRestaurantLevel0":
                playerObj.heal(1);
                return;
            case "RestoreHealth":
            case "RestoreHealthRestaurantLevel1":
                playerObj.heal(Math.ceil(Rpg.character.status.healthMax / 3));
                return;
            case "RestoreHealthRestaurantLevel2":
                playerObj.heal(Math.ceil(Rpg.character.status.healthMax * 0.8));
                return;
            case "Poison":
                Rpg.character.status.conditions.poison.level += 1;
                return;
            case "PoisonRestore":
                Rpg.character.status.conditions.poison.value = 0;
                Rpg.character.status.conditions.poison.level = 0;
                return;
            case "Ballon":
                playerObj.damage(atkBallon);
                return;
            case "Wetness":
                playerObj.damage(atkWetness);
                return;
            case "ForgetLooseValuableCollection":
                Rpg.looseValuables.forgetCollection();
                return;
            case "__Fallback__":
                return;
        }
    }
}

const atkBallon = RpgAttack.create({
    conditions: {
        helium: 99999999,
    },
});

const atkWetness = RpgAttack.create({
    conditions: {
        wetness: {
            tint: 0x0080ff,
            value: 999999,
        },
    },
});
