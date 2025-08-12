import { Texture } from "pixi.js";
import { Rpg } from "../rpg/rpg";
import { RpgPlayer } from "../rpg/rpg-player";
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
                use: () =>
                    // TODO because of questionable decisions, I think this will not produce the delta animation
                    Rpg.character.status.health = Math.min(
                        RpgPlayer.status.health + Math.ceil(RpgPlayer.status.healthMax / 3),
                        RpgPlayer.status.healthMax,
                    ),
            },
            Poison: {
                name: "Poison",
                description: "",
                texture: null,
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
