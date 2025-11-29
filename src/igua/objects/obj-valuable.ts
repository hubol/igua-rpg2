import { Logger } from "../../lib/game-engine/logger";
import { Rng } from "../../lib/math/rng";
import { container } from "../../lib/pixi/container";
import { mxnCollectible } from "../mixins/mxn-collectible";
import { mxnSparkling } from "../mixins/mxn-sparkling";
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

    const computedKind = uid === undefined ? kind : Rpg.looseValuables.trySpawn(uid, kind);

    const valuableObj = objFigureValuable(computedKind ?? "green");

    return valuableObj
        .mixin(
            mxnCollectible,
            uid === undefined
                ? { kind: "transient", collectable: false }
                : {
                    kind: "controlled",
                    isCollected: computedKind === null,
                    collect: () => {
                        Rpg.looseValuables.collect(uid);
                        container()
                            .at(valuableObj)
                            .mixin(mxnSparkling)
                            .step(self =>
                                self.sparklesPerFrame = Rpg.looseValuables.trySpawn(uid, kind) ? Rng.float(0.05) : 0
                            )
                            .show();
                    },
                },
        )
        .handles("collected", self => {
            if (computedKind === null) {
                Logger.logAssertError(
                    "objValuable",
                    new Error("mxnCollectible:collected fired for a valuable that should not be spawned"),
                );
                return;
            }
            self.objFigureValuable.methods.collectFx();
            Rpg.wallet.earn("valuables", RpgEconomy.Valuables.Values[computedKind], reason);
        })
        .step(self => self.collectable = collectableAfterSteps-- <= 0);
}

export type ObjValuable = ReturnType<typeof objValuable>;
