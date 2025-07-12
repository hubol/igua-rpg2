import { Graphics, Sprite, Texture } from "pixi.js";
import { Tx } from "../../assets/textures";
import { VectorSimple } from "../../lib/math/vector-type";
import { CollisionShape } from "../../lib/pixi/collision";
import { container } from "../../lib/pixi/container";
import { Null } from "../../lib/types/null";
import { DataIdol } from "../data/data-idol";
import { DramaKeyItems } from "../drama/drama-key-items";
import { mxnCutscene } from "../mixins/mxn-cutscene";
import { RpgScenePlayerBuffsMutator } from "../rpg/rpg-player-aggregated-buffs";

interface IdolStyle {
    tx: Texture;
    pivot: VectorSimple;
}

const styles = new Map<DataIdol.Id, IdolStyle>();
styles.set("Yellow", {
    tx: Tx.Furniture.Artwork.Statue0,
    pivot: [32, 97],
});
styles.set("Green", {
    tx: Tx.Furniture.Artwork.Statue1,
    pivot: [30, 73],
});
styles.set("Blue", {
    tx: Tx.Furniture.Artwork.Statue2,
    pivot: [52, 47],
});
styles.set("Purple", {
    tx: Tx.Furniture.Artwork.Statue3,
    pivot: [36, 70],
});

const keyItemIds = Object.values(DataIdol.Manifest)
    .map(({ keyItemId }) => keyItemId)
    .filter(keyItemId => keyItemId !== "__Fallback__");

export function objIdol() {
    const collisionShapeObj = new Graphics().beginFill(0).drawRect(-10, -10, 20, 20).invisible();
    let idolId = Null<DataIdol.Id>();

    const sprite = new Sprite();

    function updateSprite() {
        const style = styles.get(idolId!);
        sprite.visible = Boolean(idolId);
        if (style) {
            sprite.texture = style.tx;
            sprite.pivot.at(style.pivot);
        }
    }

    updateSprite();

    return container(collisionShapeObj, sprite)
        .collisionShape(CollisionShape.DisplayObjects, [collisionShapeObj])
        .mixin(mxnCutscene, function* () {
            const result = yield* DramaKeyItems.use({ keyItemIds });
            if (result && result.count) {
                const idol = Object.values(DataIdol.Manifest).find(idol => idol.keyItemId === result.keyItemId);
                idolId = idol?.id ?? null;
                RpgScenePlayerBuffsMutator.value.mutatorFn = DataIdol.getById(idol?.id!).buffs;
            }
            updateSprite();
        });
}
