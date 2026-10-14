import { Graphics, Sprite } from "pixi.js";
import { Tx } from "../../../assets/textures";
import { CollisionShape } from "../../../lib/pixi/collision";
import { container } from "../../../lib/pixi/container";
import { ZIndex } from "../../core/scene/z-index";
import { mxnDetectPlayer } from "../../mixins/mxn-detect-player";
import { mxnFacingPivot } from "../../mixins/mxn-facing-pivot";
import { mxnHasHead } from "../../mixins/mxn-has-head";
import { mxnSpeaker } from "../../mixins/mxn-speaker";

const [
    txTorsoDefault,
    txTorsoSwordRaised,
    txSoulAmulet,
    txLaughHead,
    txMouthDemo,
    txNose,
    txEyesDemo,
] = Tx.Characters.BattleMaster.Layers.split({ width: 120 });

export function objCharacterBattleMaster() {
    const api = {
        swordRaised: false,
    };

    const headObj = new Graphics().beginFill(0xff0000).drawRect(42, 18, 58, 54);
    const collisionObj = new Graphics().beginFill(0xff0000).drawRect(20, 19, 100, 101);

    return container(
        Sprite.from(txTorsoDefault).step(self => self.texture = api.swordRaised ? txTorsoSwordRaised : txTorsoDefault),
        container(
            Sprite.from(txLaughHead),
            Sprite.from(txNose).mixin(mxnFacingPivot, { left: -1, right: 1, up: 0, down: 0 }),
            Sprite.from(txEyesDemo),
            Sprite.from(txMouthDemo),
        )
            .mixin(mxnFacingPivot, { left: -2, right: 2, up: 0, down: 0 }),
        Sprite.from(txSoulAmulet)
            .mixin(mxnFacingPivot, { left: -3, right: 3, up: 0, down: 0 }),
        headObj.invisible(),
        collisionObj.invisible(),
    )
        .pivoted(71, 118)
        .collisionShape(CollisionShape.DisplayObjects, [collisionObj])
        .mixin(mxnDetectPlayer)
        .mixin(mxnHasHead, { obj: headObj })
        .mixin(mxnSpeaker, { name: "Battle Master Warren", tintPrimary: 0xFFC700, tintSecondary: 0x3E4EA8 })
        .zIndexed(ZIndex.CharacterEntities);
}
