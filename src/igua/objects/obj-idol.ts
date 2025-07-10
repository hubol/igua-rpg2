import { Graphics, Sprite, Texture } from "pixi.js";
import { Tx } from "../../assets/textures";
import { Integer } from "../../lib/math/number-alias-types";
import { Vector } from "../../lib/math/vector-type";
import { CollisionShape } from "../../lib/pixi/collision";
import { container } from "../../lib/pixi/container";
import { DataKeyItemInternalName } from "../data/data-key-items";
import { DramaKeyItems } from "../drama/drama-key-items";
import { mxnCutscene } from "../mixins/mxn-cutscene";
import { RpgScenePlayerBuffsMutator } from "../rpg/rpg-player-aggregated-buffs";
import { RpgPlayerBuffs } from "../rpg/rpg-player-buffs";

const styles = new Map<Texture, Vector>();
styles.set(Tx.Furniture.Artwork.Statue0, [32, 97]);
styles.set(Tx.Furniture.Artwork.Statue1, [30, 73]);
styles.set(Tx.Furniture.Artwork.Statue2, [52, 47]);
styles.set(Tx.Furniture.Artwork.Statue3, [36, 70]);

const textures = [
    Tx.Furniture.Artwork.Statue0,
    Tx.Furniture.Artwork.Statue1,
    Tx.Furniture.Artwork.Statue2,
    Tx.Furniture.Artwork.Statue3,
];

const itemToIndex = {
    SeedYellow: 0,
    SeedGreen: 1,
    SeedBlue: 2,
    SeedPurple: 3,
} satisfies Partial<Record<DataKeyItemInternalName, Integer>>;

// TODO very temporary!!
const testScenePlayerBuffsMutator: RpgPlayerBuffs.MutatorFn = (model) => model.loot.valuables.bonus += 100;

export function objIdol() {
    const collisionShapeObj = new Graphics().beginFill(0).drawRect(-10, -10, 20, 20).invisible();
    let index = -1;

    const sprite = new Sprite();

    function updateSprite() {
        sprite.texture = textures[index] ?? textures[0];
        sprite.pivot.at(styles.get(sprite.texture)!);
        sprite.visible = index >= 0;
    }

    updateSprite();

    return container(collisionShapeObj, sprite)
        .collisionShape(CollisionShape.DisplayObjects, [collisionShapeObj])
        .mixin(mxnCutscene, function* () {
            const result = yield* DramaKeyItems.use({
                items: Object.keys(itemToIndex) as (keyof typeof itemToIndex)[],
            });
            RpgScenePlayerBuffsMutator.value.mutatorFn = testScenePlayerBuffsMutator;
            if (result && result.count) {
                index = itemToIndex[result.item];
            }
            updateSprite();
        });
}
