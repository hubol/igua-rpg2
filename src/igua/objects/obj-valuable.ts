import { mxnCollectible } from "../mixins/mxn-collectible";
import { Rpg } from "../rpg/rpg";
import { RpgEconomy } from "../rpg/rpg-economy";
import { RpgPlayerWallet } from "../rpg/rpg-player-wallet";
import { objFigureValuable } from "./figures/obj-figure-valuable";

export function objValuable(
    kind: RpgEconomy.Valuables.Kind,
    uid?: number,
    reason: RpgPlayerWallet.EarnReason = "default",
) {
    let collectableAfterSteps = 5;

    return objFigureValuable(kind)
        .mixin(
            mxnCollectible,
            uid === undefined
                ? { kind: "transient", collectable: false }
                : { kind: "uid", uid, set: Rpg.programmaticFlags.collectedValuableUids },
        )
        .handles("collected", self => {
            self.objFigureValuable.methods.collectFx();
            Rpg.wallet.earn("valuables", RpgEconomy.Valuables.Values[kind], reason);
        })
        .step(self => self.collectable = collectableAfterSteps-- <= 0);
}

export type ObjValuable = ReturnType<typeof objValuable>;
