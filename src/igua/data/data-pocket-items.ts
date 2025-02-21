import { Texture } from "pixi.js";
import { Tx } from "../../assets/textures";

interface DataPocketItem {
    name: string;
    texture: Texture;
}

export const DataPocketItems = {
    BallFruitTypeA: { name: "Ball Fruit Type A", texture: Tx.Collectibles.BallFruitTypeA },
    BallFruitTypeB: { name: "Ball Fruit Type B", texture: Tx.Collectibles.BallFruitTypeB },
    ComputerChip: { name: "Computer Chip V1.0", texture: Tx.Collectibles.ComputerChip },
} satisfies Record<string, DataPocketItem>;

export type DataPocketItemInternalName = keyof typeof DataPocketItems;
