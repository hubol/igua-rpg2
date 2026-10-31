import { Sprite } from "pixi.js";
import { Sfx } from "../../../assets/sounds";
import { Tx } from "../../../assets/textures";
import { Rng } from "../../../lib/math/rng";
import { ZIndex } from "../../core/scene/z-index";
import { DramaInventory } from "../../drama/drama-inventory";
import { mxnInteract } from "../../mixins/mxn-interact";
import { Rpg } from "../../rpg/rpg";
import { RpgEnemyRank } from "../../rpg/rpg-enemy-rank";
import { RpgInventory } from "../../rpg/rpg-inventory";
import { RpgLoot } from "../../rpg/rpg-loot";
import { objLootDrop } from "../obj-loot-drop";

export function objEsotericBoneChest() {
    const keyItem: RpgInventory.Item.KeyItem = { kind: "key_item", id: "BoneKey" };
    const obj = Sprite.from(Tx.Esoteric.Dungeon.BoneChest);

    let isOpening = false;

    return obj
        .anchored(0.5, 1)
        .mixin(mxnInteract, () => {
            if (isOpening) {
                return;
            }

            if (!Rpg.inventory.has(keyItem)) {
                Sfx.Interact.Error.play();
                return;
            }

            isOpening = true;
            obj.coro(function* () {
                yield* DramaInventory.removeCount(keyItem, 1);
                const drop = Rpg.loot.drop(lootTable, dummyStatus, Rpg.character.buffs.loot);
                objLootDrop(drop)
                    .at(obj)
                    .show();
                obj.destroy();
            });
        })
        .zIndexed(ZIndex.BackgroundEntities);
}

const dummyStatus = RpgEnemyRank.create({}).status;

const lootTable: RpgLoot.Table = {
    tier0: [
        {
            kind: "valuables",
            deltaPride: 0,
            min: 0,
            // TODO this is hack... but i like it
            get max() {
                return Rng.intc(1, 4) * 10;
            },
        },
        {
            kind: "pocket_item",
            id: "BoneTypeA",
            get count() {
                return Rng.intc(1, 5) * 2;
            },
        },
    ],
};
