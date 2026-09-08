import { Graphics, Sprite } from "pixi.js";
import { Tx } from "../../../assets/textures";
import { CollisionShape } from "../../../lib/pixi/collision";
import { container } from "../../../lib/pixi/container";
import { ZIndex } from "../../core/scene/z-index";
import { DataTemporaryEffect } from "../../data/data-temporary-effect";
import { mxnHasHead } from "../../mixins/mxn-has-head";
import { mxnInteract } from "../../mixins/mxn-interact";
import { Rpg } from "../../rpg/rpg";

const [txStatue, txLight] = Tx.Esoteric.WizardOfLightStatue.split({ count: 2 });

export function objEsotericWizardOfLightStatue() {
    const effectId: DataTemporaryEffect.Id = "LightFromWizardStatue";
    const collisionObj = new Graphics().beginFill(0xff0000).drawRect(15, 4, 53, 80).invisible();

    return container(
        Sprite.from(txStatue),
        Sprite.from(txLight).step(self =>
            self.alpha = Math.ceil(Rpg.character.temporaryEffects.getRemainingUnit(effectId) * 10) / 10
        ),
        collisionObj,
    )
        .collisionShape(CollisionShape.DisplayObjects, [collisionObj])
        .mixin(mxnInteract, () => Rpg.character.temporaryEffects.add(effectId, 60))
        .mixin(mxnHasHead, { obj: collisionObj })
        .pivoted(41, 82)
        .zIndexed(ZIndex.CharacterEntities);
}
