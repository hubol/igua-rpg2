import { Graphics, Sprite, Texture } from "pixi.js";
import { Tx } from "../../assets/textures";
import { Vector } from "../../lib/math/vector-type";
import { CollisionShape } from "../../lib/pixi/collision";
import { container } from "../../lib/pixi/container";
import { mxnInteract } from "../mixins/mxn-interact";

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

export function objIdol() {
    const collisionShapeObj = new Graphics().beginFill(0).drawRect(-10, -10, 20, 20).invisible();
    let index = 0;

    const sprite = new Sprite();

    function updateSprite() {
        sprite.texture = textures[index];
        sprite.pivot.at(styles.get(sprite.texture)!);
    }

    updateSprite();

    return container(collisionShapeObj, sprite)
        .collisionShape(CollisionShape.DisplayObjects, [collisionShapeObj])
        .mixin(mxnInteract, () => {
            index = (index + 1) % textures.length;
            updateSprite();
        });
}
