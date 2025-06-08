import { RgbInt } from "../../lib/math/number-alias-types";
import { ZIndex } from "../core/scene/z-index";
import { objFxEnemyDefeat } from "../objects/effects/obj-fx-enemy-defeat";
import { MxnEnemy } from "./mxn-enemy";

interface MxnEnemyDeathBurstArgs {
    primaryTint: RgbInt;
    secondaryTint: RgbInt;
    tertiaryTint: RgbInt;
}

export function mxnEnemyDeathBurst(obj: MxnEnemy, args: MxnEnemyDeathBurstArgs) {
    return obj.handles(
        "mxnEnemy.died",
        () =>
            objFxEnemyDefeat(args)
                .at(obj.mxnEnemy.soulAnchorObj.getWorldPosition())
                .zIndexed(ZIndex.EnemyDeathBursts)
                .show(),
    );
}
