import { Graphics, Texture } from "pixi.js";
import { OgmoEntities } from "../../assets/generated/levels/generated-ogmo-project-data";
import { Tx } from "../../assets/textures";
import { VectorSimple, vnew } from "../../lib/math/vector-type";
import { CollisionShape } from "../../lib/pixi/collision";
import { container } from "../../lib/pixi/container";
import { DataIdol } from "../data/data-idol";
import { DramaKeyItems } from "../drama/drama-key-items";
import { mxnCutscene } from "../mixins/mxn-cutscene";
import { Rpg } from "../rpg/rpg";
import { RpgSceneIdol } from "../rpg/rpg-player-aggregated-buffs";
import { objTransitionedSprite } from "./utils/obj-transitioned-sprite";

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

export function objIdol({ uid }: OgmoEntities.Idol) {
    const collisionShapeObj = new Graphics().beginFill(0).drawRect(-10, -10, 20, 20).invisible();
    const idol = Rpg.idols(uid);

    const sprite = objTransitionedSprite({
        txProvider: () => styles.get(idol.idolId!)?.tx ?? null,
        anchorProvider: () => {
            const style = styles.get(idol.idolId!);
            return style ? vnew(style.pivot).scale(1 / style.tx.width, 1 / style.tx.height) : [0, 0];
        },
    });

    return container(collisionShapeObj, sprite)
        .collisionShape(CollisionShape.DisplayObjects, [collisionShapeObj])
        .mixin(mxnCutscene, function* () {
            const result = yield* DramaKeyItems.use({ keyItemIds });
            if (result && result.count) {
                const dataIdol = Object.values(DataIdol.Manifest).find(idol => idol.keyItemId === result.keyItemId);
                idol.upload(dataIdol?.id!);
            }
        })
        .step(() => {
            idol.tick();
            RpgSceneIdol.value.idol = idol;
        });
}
