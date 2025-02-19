import { Texture } from "pixi.js";
import { Tx } from "../../assets/textures";
import { RpgPocket } from "../rpg/rpg-pocket";

interface PocketItemData {
    name: string;
    texture: Texture;
}

export const DataPocketItem: Record<RpgPocket.Item, PocketItemData> = {
    BallFruitTypeA: { name: "Ball Fruit Type A", texture: Tx.Collectibles.BallFruitTypeA },
    BallFruitTypeB: { name: "Ball Fruit Type B", texture: Tx.Collectibles.BallFruitTypeB },
};
