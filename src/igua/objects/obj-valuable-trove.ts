import { DisplayObject } from "pixi.js";
import { container } from "../../lib/pixi/container";
import { Empty } from "../../lib/types/empty";
import { RpgEconomy } from "../rpg/rpg-economy";
import { objValuable } from "./obj-valuable";
import { sleepf } from "../../lib/game-engine/routines/sleep";
import { mxnNudgeAppear } from "../mixins/mxn-nudge-appear";
import { ValuableChangeMaker } from "../systems/valuable-change-maker";

type Tiers = number[];

function solveTiers(count: number): Tiers {
    let ones = 0;
    let twos = 0;
    let threes = 0;
    let fours = 0;

    let sum = 0;
    let i = 1;

    while (sum < count) {
        if (i === 1) {
            ones += 2;
        }
        else if (i === 2) {
            twos += 2;
        }
        else if (i === 3) {
            threes += 2;
        }
        else if (i === 4) {
            fours += 2;
        }

        sum += i * 2;

        i = Math.min(4, i + 1);
    }

    const error = sum - count;

    if (error === 7) {
        fours -= 1;
        threes -= 1;
    }
    else if (error === 6) {
        fours -= 1;
        twos -= 1;
    }
    else if (error === 5) {
        if (fours > 0) {
            fours -= 1;
            ones -= 1;
        }
        else {
            threes -= 1;
            twos -= 1;
        }
    }
    else if (error === 4) {
        if (fours > 0) {
            fours -= 1;
        }
        else {
            twos -= 2;
        }
    }
    else if (error === 3) {
        if (threes > 0) {
            threes -= 1;
        }
        else {
            twos -= 1;
            ones -= 1;
        }
    }
    else if (error === 2) {
        twos -= 1;
    }
    else if (error === 1) {
        ones -= 1;
    }

    if (threes % 2 === 1) {
        if (ones === 1) {
            threes -= 1;
            fours += 1;
            ones -= 1;
        }
        if (fours >= 1 && twos === 1) {
            twos = 0;
            fours -= 1;
            threes += 3;
        }
    }

    if (twos === 1 && ones === 2) {
        twos = 2;
        ones = 0;
    }

    if (ones === 1 && twos === 1 && threes % 2 === 1) {
        threes -= 1;
        twos = 2;
        ones = 2;
    }

    if (ones === 1 && twos === 2 && threes > 0) {
        threes += 1;
        twos = 0;
        ones = 2;
    }

    if (fours % 2 === 1 && threes % 2 === 1 && ones === 2) {
        fours -= 1;
        ones -= 2;
        threes += 2;
    }

    if (twos === 0 && fours % 2 === 1 && threes % 2 === 1) {
        fours -= 1;
        twos += 2;
    }

    const tiers: Tiers = [];

    if (threes % 2 === 1 && fours % 2 === 0) {
        tiers.push(3);
        threes -= 1;
    }

    for (let i = 0; i < fours; i++) {
        tiers[i % 2 === 0 ? "push" : "unshift"](4);
    }

    for (let i = 0; i < threes; i++) {
        tiers[i % 2 === 0 ? "push" : "unshift"](3);
    }

    for (let i = 0; i < twos; i++) {
        tiers[i % 2 === 0 ? "push" : "unshift"](2);
    }

    for (let i = 0; i < ones; i++) {
        tiers[i % 2 === 0 ? "push" : "unshift"](1);
    }

    return tiers;
}

type Layout = RpgEconomy.Currency.Type[][];

function solveLayout(counts: ValuableChangeMaker.Counts, tiers: Tiers) {
    const sortedCounts = Object.entries(counts)
        .map(([type, value]) => ({ type: type as RpgEconomy.Currency.Type, value }))
        .sort((a, b) => b.value - a.value);

    const layout: Layout = tiers.map(() => []);

    let min = 0;
    let max = layout.length - 1;
    let useMin = true;

    for (let i = 0; i < sortedCounts.length; i++) {
        const count = sortedCounts[i];
        while (count.value > 0) {
            const index = useMin ? min : max;
            count.value -= 1;
            layout[index].push(count.type);
            if (layout[index].length >= tiers[index]) {
                if (useMin) {
                    min += 1;
                }
                else {
                    max -= 1;
                }
            }
            useMin = !useMin;
        }
    }

    return layout;
}

const hMargin = 18;
const vMargin = 13;

export function objValuableTrove(total: number, animation: "animated" | "instant" = "animated") {
    const counts = ValuableChangeMaker.solveCounts(total);
    const count = Object.values(counts).reduce((sum, current) => sum + current, 0);
    const tiers = solveTiers(count);
    const layout = solveLayout(counts, tiers);

    const c = container();

    const valuableObjs = Empty<DisplayObject>();

    let y = (tiers.length - 1) * vMargin / -2;
    for (const row of layout) {
        const rowCount = row.length;
        let x = (rowCount - 1) * hMargin / -2;
        for (let i = 0; i < rowCount; i++) {
            valuableObjs.push(objValuable(row[i]).at(x, y).vround());
            x += hMargin;
        }
        y += vMargin;
    }

    if (animation === "instant") {
        c.addChild(...valuableObjs);
    }
    else {
        c.coro(function* () {
            for (const valuableObj of valuableObjs) {
                valuableObj.mixin(mxnNudgeAppear).show(c);
                yield sleepf(2);
            }
        });
    }

    return c;
}
