import { Container } from "pixi.js";
import { Logger } from "../../lib/game-engine/logger";
import { Coro } from "../../lib/game-engine/routines/coro";
import { factor, interpv, interpvr } from "../../lib/game-engine/routines/interp";
import { sleep } from "../../lib/game-engine/routines/sleep";
import { Rng } from "../../lib/math/rng";
import { VectorSimple } from "../../lib/math/vector-type";
import { container } from "../../lib/pixi/container";
import { range } from "../../lib/range";
import { objFigureValuable } from "../objects/figures/obj-figure-valuable";
import { playerObj } from "../objects/obj-player";
import { objValuable } from "../objects/obj-valuable";
import { Rpg } from "../rpg/rpg";
import { RpgEconomy } from "../rpg/rpg-economy";
import { RpgPlayerWallet } from "../rpg/rpg-player-wallet";
import { ValuableChangeMaker } from "../systems/valuable-change-maker";
import { DramaLib } from "./drama-lib";

function getCurrencyToSpawn(total: number) {
    const counts = ValuableChangeMaker.solveCounts(total);
    return Rng.shuffle(
        Object.entries(counts).flatMap(([currencyType, count]) =>
            range(count).map(() => currencyType as RpgEconomy.Valuables.Kind)
        ),
    );
}

function* rewardValuables(
    total: number,
    reason: RpgPlayerWallet.EarnReason = "default",
) {
    const currencyToSpawn = getCurrencyToSpawn(total);
    const msDelayGenerator = generateMsDelayBetweenValuables();

    for (const currency of currencyToSpawn) {
        objValuable(currency, undefined, reason)
            .at(DramaLib.Speaker.getWorldCenter())
            .mixin(mxnValuableMotion, playerObj)
            .handles("motion:ready", self => self.collectableOnlyIfPlayerHasControl = false)
            .show();
        yield sleep(msDelayGenerator.next().value!);
    }
    yield sleep(800 - (msDelayGenerator.next().value!));
}

/** Before calling this function, you must assert that the player has the demanded amount */
function* spendValuables(
    total: number,
    reason: RpgPlayerWallet.SpendReason = "default",
) {
    const valuableSpenderObj = objValuableSpender(
        total,
        (kind) => Rpg.wallet.spend("valuables", RpgEconomy.Valuables.Values[kind], reason),
    )
        .show();

    yield () => valuableSpenderObj.destroyed;
}

function createSpentValuables(total: number) {
    objValuableSpender(total, () => {}).show();
}

function objValuableSpender(total: number, onSpend: (valuablesKind: RpgEconomy.Valuables.Kind) => void) {
    const currentSpeaker = DramaLib.Speaker.current;
    const currencyToSpawn = getCurrencyToSpawn(total);
    const msDelayGenerator = generateMsDelayBetweenValuables();

    return container()
        .coro(function* (self) {
            for (const currency of currencyToSpawn) {
                objFigureValuable(currency)
                    .at(playerObj)
                    .mixin(mxnValuableMotion, DramaLib.Speaker.getWorldCenter())
                    .handles("motion:ready", self =>
                        self.coro(function* () {
                            yield* Coro.race([
                                sleep(300),
                                () => Boolean(currentSpeaker && self.collides(currentSpeaker)),
                            ]);

                            onSpend(currency);

                            self.objFigureValuable.methods.collectFx();
                            self.destroy();
                        }))
                    .show();
                yield sleep(msDelayGenerator.next().value!);
            }
            yield sleep(800 - (msDelayGenerator.next().value!));
            self.destroy();
        });
}

function* generateMsDelayBetweenValuables() {
    let ms = 250;
    let atThresholdCount = 0;

    while (true) {
        yield ms;

        if (atThresholdCount > 50) {
            ms = Math.max(70, ms - 1);
        }
        else if (ms === 100) {
            atThresholdCount++;
        }
        else {
            ms = Math.max(100, ms - 6);
        }
    }
}

function mxnValuableMotion(obj: Container, targetPosition: VectorSimple) {
    return obj
        .scaled(0, 0)
        .dispatches<"motion:ready">()
        .coro(function* (self) {
            let steps = Rng.int(0, 1000);
            const wiggle = container().step(() => obj.pivot.x = Math.round(Math.sin(steps++ * 0.2) * 4)).show(obj);

            yield* Coro.all([
                interpv(obj.scale).steps(3).to(1, 1).over(100),
                interpvr(obj).factor(factor.sine).translate(0, -100).over(500),
            ]);

            wiggle.destroy();

            self.dispatch("motion:ready");

            yield interpvr(obj).factor(factor.sine).to(targetPosition).over(300);
        });
}

export const DramaWallet = {
    createSpentValuables,
    rewardValuables,
    spendValuables,
};
