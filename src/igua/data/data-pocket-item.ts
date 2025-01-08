import { Texture } from "pixi.js";
import { RpgPocket } from "../rpg/rpg-pocket";
import { Tx } from "../../assets/textures";

interface PocketItemData {
    name: string;
    texture: Texture;
}

export const DataPocketItem: Record<RpgPocket.Item, PocketItemData> = {
    BallFruitTypeA: { name: "Ball Fruit Type A", texture: Tx.Pottery.Ball0 },
};
