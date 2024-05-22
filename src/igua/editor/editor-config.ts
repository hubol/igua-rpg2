import { Sprite } from "pixi.js";
import { LevelDisplayObjectConstructors } from "../../lib/game-engine/level-editor/editor";
import { objSolidBlock } from "../objects/obj-terrain";
import { Tx } from "../../assets/textures";

export const IguaLevelFactoryMap = {
    // 'Block': () => Sprite.from(Tx.Placeholder),
    'Block': () => objSolidBlock().scaled(32, 32),
} satisfies LevelDisplayObjectConstructors;