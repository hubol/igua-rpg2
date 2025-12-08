import { Sprite } from "pixi.js";
import { Tx } from "../../../assets/textures";
import { onMutate } from "../../../lib/game-engine/routines/on-mutate";
import { container } from "../../../lib/pixi/container";
import { ZIndex } from "../../core/scene/z-index";
import { Rpg } from "../../rpg/rpg";

export function objEsotericRemovedShoes() {
    const shoeObjs = [
        Sprite.from(Tx.Furniture.LittleShoe).tinted(0xc47f7f).at(-1, -1),
        Sprite.from(Tx.Furniture.LittleShoe).at(-9, 0),
        Sprite.from(Tx.Furniture.LittleShoe).tinted(0xc47f7f).at(17, -1),
        Sprite.from(Tx.Furniture.LittleShoe).at(9, 0),
    ]
        .map(obj => obj.anchored(0.5, 1).invisible());

    let visibleShoesCount = 0;

    return container(...shoeObjs)
        .coro(function* () {
            while (true) {
                const previousSlotsUsedCount = Rpg.inventory.equipment.loadout.slotsUsedCount;
                yield onMutate(Rpg.inventory.equipment.loadout.items);
                const slotsUsedCount = Rpg.inventory.equipment.loadout.slotsUsedCount;
                const nextVisibleShoesCount = Math.max(
                    0,
                    Math.min(shoeObjs.length, visibleShoesCount + previousSlotsUsedCount - slotsUsedCount),
                );
                for (let i = 0; i < shoeObjs.length; i++) {
                    shoeObjs[i].visible = nextVisibleShoesCount > i;
                }
                visibleShoesCount = nextVisibleShoesCount;
            }
        })
        .pivoted(0, -3)
        .zIndexed(ZIndex.TerrainDecals);
}
