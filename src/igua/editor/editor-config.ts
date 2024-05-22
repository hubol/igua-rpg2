import { Sprite } from "pixi.js";
import { LevelDisplayObjectConstructors } from "../../lib/game-engine/level-editor/editor";
import { objSolidBlock } from "../objects/obj-terrain";
import { Tx } from "../../assets/textures";
import { getDefaultLooks } from "../iguana/get-default-looks";
import { objIguanaPuppet } from "../iguana/obj-iguana-puppet";

const defaultLooks = getDefaultLooks();

export const IguaLevelFactoryMap = {
    'Placeholder': () => Sprite.from(Tx.Placeholder),
    'Block': () => objSolidBlock().scaled(32, 32),
    'Player': () => objIguanaPuppet(defaultLooks),
} satisfies LevelDisplayObjectConstructors;