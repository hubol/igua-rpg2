import { Texture } from "pixi.js";
import { Tx } from "../../assets/textures";
import { playerObj } from "../objects/obj-player";
import { Rpg } from "../rpg/rpg";
import { DataLib } from "./data-lib";

export namespace DataPotion {
    export interface Model {
        name: string;
        description: string;
        texture: Texture | null;
        use: () => void;
    }

    export const Manifest = DataLib.createManifest(
        {
            AttributeHealthUp: {
                name: "Spiced Nectar",
                description: "Delicious nectar. Increases maximum HP.",
                texture: null,
                use: () => Rpg.character.attributes.update("health", 1),
            },
            AttributeIntelligenceUp: {
                name: "Foul Stew",
                description: "Odiforous soup. Increases intelligence.",
                texture: null,
                use: () => Rpg.character.attributes.update("intelligence", 1),
            },
            AttributeStrengthUp: {
                name: "Claw Powder",
                description: "Fine grit for sharpening claws. Increases physical attack power.",
                texture: null,
                use: () => Rpg.character.attributes.update("strength", 1),
            },
            RestoreHealth: {
                name: "Sweet Berry",
                description: "",
                texture: null,
                use: () => playerObj.heal(Math.ceil(Rpg.character.status.healthMax / 3)),
            },
            Poison: {
                name: "Poison",
                description: "",
                texture: Tx.Collectibles.Potion.Poison,
                use: () => Rpg.character.status.conditions.poison.level += 1,
            },
            PoisonRestore: {
                name: "Bitter Medicine",
                description: "",
                texture: null,
                use: () => {
                    Rpg.character.status.conditions.poison.value = 0;
                    Rpg.character.status.conditions.poison.level = 0;
                },
            },
            __Fallback__: {
                name: "???",
                description: "Consume to experience a bug",
                texture: null,
                use: () => {},
            },
        } satisfies Record<string, Model>,
    );

    export type Id = keyof typeof Manifest;

    export const getById = DataLib.createGetById({ manifest: Manifest, namespace: "DataPotion" });
}
