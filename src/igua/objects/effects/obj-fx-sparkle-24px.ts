import { Tx } from "../../../assets/textures";
import { container } from "../../../lib/pixi/container";
import { mxnDestroyAfterSteps } from "../../mixins/mxn-destroy-after-steps";
import { mxnDestroyOnEmpty } from "../../mixins/mxn-destroy-on-empty";
import { mxnMotion } from "../../mixins/mxn-motion";
import { objIndexedSprite } from "../utils/obj-indexed-sprite";
import { FxPattern } from "./lib/fx-pattern";

const txs = Tx.Effects.Sparkle24px.split({ width: 24 });

export function objFxSparkle24Px() {
    return objIndexedSprite(txs)
        .step(self => self.textureIndex = (self.textureIndex + 0.2) % txs.length)
        .anchored(0.5, 0.5);
}

objFxSparkle24Px.objFxBurst = function objFxSparkle24PxBurst () {
    const burstObj = container()
        .mixin(mxnDestroyOnEmpty);

    for (const node of FxPattern.getRadialBurst({ radius: 0, rotation: 0, count: 16 })) {
        const sparkleObj = objFxSparkle24Px()
            .at(node.position)
            .mixin(mxnMotion)
            .mixin(mxnDestroyAfterSteps, 60 * 10)
            .step(self => self.speed.vlength += 0.01)
            .show(burstObj);

        sparkleObj.speed.at(node.normal);
    }

    return burstObj;
};
