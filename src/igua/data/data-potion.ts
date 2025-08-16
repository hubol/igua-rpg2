import { Texture } from "pixi.js";
import { Tx } from "../../assets/textures";
import { RgbInt } from "../../lib/math/number-alias-types";
import { playerObj } from "../objects/obj-player";
import { Rpg } from "../rpg/rpg";
import { DataLib } from "./data-lib";

export namespace DataPotion {
    export interface Model {
        name: string;
        description: string;
        stinkLineTint: RgbInt;
        texture: Texture | null;
        use: () => void;
    }

    export const Manifest = DataLib.createManifest(
        {
            AttributeHealthUp: {
                name: "Spiced Nectar",
                description: "Delicious nectar. Increases maximum HP.",
                stinkLineTint: 0xffffff,
                texture: null,
                use: () => Rpg.character.attributes.update("health", 1),
            },
            AttributeIntelligenceUp: {
                name: "Foul Stew",
                description: "Odiforous soup. Increases intelligence.",
                stinkLineTint: 0xffffff,
                texture: null,
                use: () => Rpg.character.attributes.update("intelligence", 1),
            },
            AttributeStrengthUp: {
                name: "Claw Powder",
                description: "Fine grit for sharpening claws. Increases physical attack power.",
                stinkLineTint: 0xffffff,
                texture: null,
                use: () => Rpg.character.attributes.update("strength", 1),
            },
            RestoreHealth: {
                name: "Sweet Berry",
                description: "",
                stinkLineTint: 0xD882D1,
                texture: Tx.Collectibles.Potion.RestoreHealth,
                use: () => playerObj.heal(Math.ceil(Rpg.character.status.healthMax / 3)),
            },
            Poison: {
                name: "Poison",
                description: "",
                stinkLineTint: 0xA53609,
                texture: Tx.Collectibles.Potion.Poison,
                use: () => Rpg.character.status.conditions.poison.level += 1,
            },
            PoisonRestore: {
                name: "Bitter Medicine",
                description: "",
                stinkLineTint: 0xffffff,
                texture: null,
                use: () => {
                    Rpg.character.status.conditions.poison.value = 0;
                    Rpg.character.status.conditions.poison.level = 0;
                },
            },
            __Fallback__: {
                name: "???",
                description: "Consume to experience a bug",
                stinkLineTint: 0xff00ff,
                texture: null,
                use: () => {},
            },
        } satisfies Record<string, Model>,
    );

    export type Id = keyof typeof Manifest;

    export const getById = DataLib.createGetById({ manifest: Manifest, namespace: "DataPotion" });
}
