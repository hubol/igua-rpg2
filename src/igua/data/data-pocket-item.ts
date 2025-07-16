import { Texture } from "pixi.js";
import { Tx } from "../../assets/textures";
import { DataLib } from "./data-lib";

export namespace DataPocketItem {
    export interface Model {
        name: string;
        texture: Texture;
    }

    export const Manifest = DataLib.createManifest(
        {
            BallFruitTypeA: { name: "Ball Fruit Type A", texture: Tx.Collectibles.BallFruitTypeA },
            BallFruitTypeB: { name: "Ball Fruit Type B", texture: Tx.Collectibles.BallFruitTypeB },
            ComputerChip: { name: "Computer Chip V1.0", texture: Tx.Collectibles.ComputerChip },
            __Fallback__: { name: "???", texture: Tx.Collectibles.ComputerChip },
        } satisfies Record<string, Model>,
    );

    export type Id = keyof typeof Manifest;

    export const getById = DataLib.createGetById({ manifest: Manifest, namespace: "DataPocketItem" });
}
