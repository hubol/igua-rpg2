import { container } from "../../lib/pixi/container";
import { RpgEconomy } from "../rpg/rpg-economy";
import { objValuable } from "../objects/obj-valuable";
import { sleep } from "../../lib/game-engine/routines/sleep";
import { VectorSimple } from "../../lib/math/vector-type";
import { range } from "../../lib/range";
import { Rng } from "../../lib/math/rng";
import { factor, interpv, interpvr } from "../../lib/game-engine/routines/interp";
import { playerObj } from "../objects/obj-player";
import { Coro } from "../../lib/game-engine/routines/coro";
import { ValuableChangeMaker } from "../systems/valuable-change-maker";
import { RpgPlayerWallet } from "../rpg/rpg-player-wallet";

export function* rewardValuables(
    total: number,
    startPosition: VectorSimple,
    incomeSource: RpgPlayerWallet.IncomeSource = "default",
) {
    const counts = ValuableChangeMaker.solveCounts(total);
    const currencyToSpawn = Rng.shuffle(
        Object.entries(counts).flatMap(([currencyType, count]) =>
            range(count).map(() => currencyType as RpgEconomy.Currency.Type)
        ),
    );

    let ms = 250;
    let atThresholdCount = 0;

    for (const currency of currencyToSpawn) {
        objValuable(currency, undefined, incomeSource).at(startPosition).scaled(0, 0).coro(moveTowardsPlayer).show();
        yield sleep(ms);

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
    yield sleep(800 - ms);
}
function* moveTowardsPlayer(obj: ReturnType<typeof objValuable>) {
    let steps = Rng.int(0, 1000);
    const wiggle = container().step(() => obj.pivot.x = Math.round(Math.sin(steps++ * 0.2) * 4)).show(obj);

    yield* Coro.all([
        interpv(obj.scale).steps(3).to(1, 1).over(100),
        interpvr(obj).factor(factor.sine).translate(0, -100).over(500),
    ]);

    wiggle.destroy();

    obj.collectableOnlyIfPlayerHasControl = false;

    yield interpvr(obj).factor(factor.sine).to(playerObj).over(300);
}
