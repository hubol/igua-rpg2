import { Sprite } from "pixi.js";
import { OgmoEntities } from "../../../assets/generated/levels/generated-ogmo-project-data";
import { Tx } from "../../../assets/textures";
import { mxnRpgAttack } from "../../mixins/mxn-rpg-attack";
import { RpgAttack } from "../../rpg/rpg-attack";

const variants = {
    level0: {
        atk: RpgAttack.create({ physical: 30 }),
    },
};

export function objAngelSpikeBall(entity: OgmoEntities.EnemySpikeBall) {
    const variant = variants[entity.values.variant] ?? variants.level0;

    return Sprite.from(Tx.Enemy.SpikeBall)
        .anchored(0.5, 0.5)
        .mixin(mxnRpgAttack, { attack: variant.atk });
}
