import { Graphics, Sprite } from "pixi.js";
import { objText } from "../../../assets/fonts";
import { Tx } from "../../../assets/textures";
import { approachLinear } from "../../../lib/math/number";
import { container } from "../../../lib/pixi/container";
import { scene } from "../../globals";
import { mxnBoilPivot } from "../../mixins/mxn-boil-pivot";
import { mxnBoilTextureIndex } from "../../mixins/mxn-boil-texture-index";
import { Rpg } from "../../rpg/rpg";
import { playerObj } from "../obj-player";
import { StepOrder } from "../step-order";
import { objIndexedSprite } from "../utils/obj-indexed-sprite";

const [txCloud0, txCloud1, txCloud2, txBone, txBoneText, txDustsText] = Tx.Ui.BoneDusts.split({ width: 120 });

export function objEsotericBoneDusts() {
    return container(
        objIndexedSprite([txCloud0, txCloud1, txCloud2])
            .mixin(mxnBoilTextureIndex)
            .mixin(mxnBoilPivot),
        Sprite.from(txBone)
            .mixin(mxnBoilPivot),
        Sprite.from(txBoneText)
            .mixin(mxnBoilPivot),
        Sprite.from(txDustsText)
            .mixin(mxnBoilPivot),
        new Graphics()
            .beginFill(0xC6C6C6)
            .drawCircle(0, 0, 15)
            .at(28, 39),
        objText.Large("", { align: "center", tint: 0x000000 })
            .anchored(0.5, 0.5)
            .at(28, 43)
            .step(self => self.text = String(Rpg.wallet.count("bone_dusts"))),
    )
        .step(
            self => self.x = approachLinear(self.x, Math.min(playerObj.x + 130, scene.level.width - 120), 2),
            StepOrder.AfterPhysics,
        );
}
