import { Texture } from "pixi.js";
import { Sfx } from "../../assets/sounds";
import { Tx } from "../../assets/textures";
import { Sound } from "../../lib/game-engine/audio/sound";
import { RgbInt } from "../../lib/math/number-alias-types";
import { MxnRpgStatus } from "../mixins/mxn-rpg-status";
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
        sound: Sound | null;
    }

    export const Manifest = DataLib.createManifest(
        {
            AttributeHealthUp: {
                name: "Spiced Nectar",
                description: "Delicious nectar. Increases maximum HP.",
                stinkLineTint: 0x004AFF,
                texture: Tx.Collectibles.Potion.AttributeHealthUp,
                sound: Sfx.Effect.Potion.AttributeHealthUp,
            },
            AttributeIntelligenceUp: {
                name: "Foul Stew",
                description: "Challenging, odiforous soup. Increases intelligence.",
                stinkLineTint: 0xCEA5AA,
                texture: Tx.Collectibles.Potion.AttributeIntelligenceUp,
                sound: Sfx.Effect.Potion.AttributeIntelligenceUp,
            },
            AttributeStrengthUp: {
                name: "Claw Powder",
                description: "Fine grit for sharpening claws. Increases physical attack power.",
                stinkLineTint: 0xB6B2FF,
                texture: Tx.Collectibles.Potion.AttributeStrengthUp,
                sound: Sfx.Effect.Potion.AttributeStrengthUp,
            },
            RestoreHealth: {
                name: "Sweet Berry",
                description: "Pungent fruit. Recover some health.",
                stinkLineTint: 0xD882D1,
                texture: Tx.Collectibles.Potion.RestoreHealth,
                sound: Sfx.Effect.Potion.RestoreHealth,
            },
            RestoreHealthRestaurantLevel0: {
                name: "Pathetic Meal",
                description: "Meal for a cheapskate. Recover negligible health.",
                stinkLineTint: 0xD882D1,
                texture: Tx.Collectibles.Potion.PatheticMeal,
                sound: Sfx.Effect.Potion.RestoreHealthBagged0,
            },
            RestoreHealthRestaurantLevel1: {
                name: "Unremarkable Meal",
                description: "Average meal. Recover some health.",
                stinkLineTint: 0xD882D1,
                texture: Tx.Collectibles.Potion.UnremarkableMeal,
                sound: Sfx.Effect.Potion.RestoreHealthBagged1,
            },
            RestoreHealthRestaurantLevel2: {
                name: "Celebratory Meal",
                description: "Oversized meal. Recover substantial health.",
                stinkLineTint: 0xD882D1,
                texture: Tx.Collectibles.Potion.CelebratoryMeal,
                sound: Sfx.Effect.Potion.RestoreHealthBagged2,
            },
            Poison: {
                name: "Poison",
                description: "Popular in most communities. Become poisoned.",
                stinkLineTint: 0xA53609,
                texture: Tx.Collectibles.Potion.Poison,
                sound: Sfx.Effect.Potion.Poison,
            },
            PoisonRestore: {
                name: "Bitter Medicine",
                description: "Expensive capsule. Recover from poison.",
                stinkLineTint: 0x7A42FF,
                texture: Tx.Collectibles.Potion.PoisonRestore,
                sound: Sfx.Effect.Potion.PoisonRestore,
            },
            Ballon: {
                name: "Ballon Fruit",
                description: "Naturally-occurring and filled with helium. What?",
                stinkLineTint: 0xE1282C,
                texture: Tx.Collectibles.Potion.Ballon,
                sound: null,
            },
            Wetness: {
                name: "TheWetter",
                description: "Celebrated beverage. Become drenched.",
                stinkLineTint: 0x2149FF,
                texture: Tx.Collectibles.Potion.Wetness,
                sound: Sfx.Effect.Potion.Wetness,
            },
            ForgetLooseValuableCollection: {
                name: "Forgeddit Fruid Snags",
                description: "Renowned flavor and texture. Loose valuables forgive your transgressions.",
                stinkLineTint: 0x808080,
                texture: Tx.Collectibles.Potion.FruitSnacks,
                sound: Sfx.Effect.Potion.LooseValuablesForget,
            },
            __Fallback__: {
                name: "???",
                description: "Consume to experience a bug",
                stinkLineTint: 0xff00ff,
                texture: null,
                sound: null,
            },
        } satisfies Record<string, Model>,
    );

    export type Id = keyof typeof Manifest;

    export const getById = DataLib.createGetById({ manifest: Manifest, namespace: "DataPotion" });

    export function usePotion(id: Id, target: MxnRpgStatus) {
        getById(id).sound?.play();

        switch (id) {
            // TODO attributes do not exist on MxnRpgStatus
            // Maybe they should?
            case "AttributeHealthUp":
                const previousHealthMax = Rpg.character.status.healthMax;
                Rpg.character.attributes.update("health", 1);
                const delta = Math.round(Rpg.character.status.healthMax - previousHealthMax);
                if (delta > 0) {
                    playerObj.heal(delta);
                }
                return;
            case "AttributeIntelligenceUp":
                Rpg.character.attributes.update("intelligence", 1);
                return;
            case "AttributeStrengthUp":
                Rpg.character.attributes.update("strength", 1);
                return;
            case "RestoreHealthRestaurantLevel0":
                target.heal(1);
                return;
            case "RestoreHealth":
            case "RestoreHealthRestaurantLevel1":
                target.heal(Math.ceil(target.status.healthMax / 3));
                return;
            case "RestoreHealthRestaurantLevel2":
                target.heal(Math.ceil(target.status.healthMax * 0.8));
                return;
            case "Poison":
                target.status.conditions.poison.level += 1;
                return;
            case "PoisonRestore":
                target.status.conditions.poison.value = 0;
                target.status.conditions.poison.level = 0;
                return;
            case "Ballon":
                target.damage(atkBallon);
                return;
            case "Wetness":
                target.damage(atkWetness);
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
