import { Graphics, Sprite } from "pixi.js";
import { OgmoEntities } from "../../../assets/generated/levels/generated-ogmo-project-data";
import { Tx } from "../../../assets/textures";
import { CollisionShape } from "../../../lib/pixi/collision";
import { container } from "../../../lib/pixi/container";
import { mxnRpgAttack } from "../../mixins/mxn-rpg-attack";
import { RpgAttack } from "../../rpg/rpg-attack";

const variants = {
    level0: {
        atk: RpgAttack.create({ physical: 30 }),
    },
};

export function objAngelSpikeBall(entity: OgmoEntities.EnemySpikeBall) {
    const variant = variants[entity.values.variant] ?? variants.level0;

    const collisionShapeObj = new Graphics().beginFill(0xff0000).drawRect(4, 3, 16, 15).invisible();

    return container(
        Sprite.from(Tx.Enemy.SpikeBall),
        collisionShapeObj,
    )
        .pivoted(12, 10)
        .collisionShape(CollisionShape.DisplayObjects, [collisionShapeObj])
        .mixin(mxnRpgAttack, { attack: variant.atk });
}
