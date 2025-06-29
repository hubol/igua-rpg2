import { Graphics } from "pixi.js";
import { interpvr } from "../../../lib/game-engine/routines/interp";
import { sleep } from "../../../lib/game-engine/routines/sleep";
import { Integer } from "../../../lib/math/number-alias-types";
import { container } from "../../../lib/pixi/container";
import { range } from "../../../lib/range";
import { RpgProgress } from "../../rpg/rpg-progress";
import { objFlopCharacter } from "../obj-flop";

export function objFlopCollectionIndicator(startingIndex: Integer, count: Integer) {
    const previousCounts: Integer[] = [];

    function setPreviousCounts(counts: Integer[]) {
        previousCounts.length = 0;
        previousCounts.push(...counts);
    }

    function getCounts() {
        return range(count).map((i) => RpgProgress.character.inventory.flops[startingIndex + i] ?? 0);
    }

    function haveCountsChanged() {
        for (let i = 0; i < count; i++) {
            const progressValue = RpgProgress.character.inventory.flops[startingIndex + i] ?? 0;
            if (progressValue !== previousCounts[i]) {
                return true;
            }
        }

        return false;
    }

    setPreviousCounts(getCounts());

    const slotObjs = range(count).map((i) =>
        objFlopCollectionIndicatorSlot(i + startingIndex, previousCounts[i + startingIndex]).at(i * 14, 0)
    );

    return container(...slotObjs)
        .coro(function* () {
            while (true) {
                yield () => haveCountsChanged();
                const counts = getCounts();
                for (let i = 0; i < counts.length; i++) {
                    if (previousCounts[i] !== counts[i]) {
                        yield* slotObjs[i].methods.updateCount(counts[i]);
                    }
                }
                setPreviousCounts(counts);
            }
        })
        .pivoted(-36, 0);
}

function objFlopCollectionIndicatorSlot(dexNumber: Integer, count: Integer) {
    const boxObj = new Graphics().pivoted(30, 60);

    const flopObj = objFlopCharacter.fromDexNumber(dexNumber).at(-30, 0).invisible();
    flopObj.filtered(flopObj.objects.filter);
    const filledTint = flopObj.state.tint.red;

    const mainObj = container(boxObj, flopObj);

    function* updateCount(nextCount: Integer) {
        yield interpvr(mainObj).to(0, -14).over(300);
        const state: DrawState = {
            filled: count > 0,
            flopVisible: false,
            size: "half",
        };
        draw(state);
        yield sleep(150);
        state.size = "full";
        state.filled = nextCount > 0;
        state.flopVisible = nextCount > 0;
        draw(state);
        yield sleep(500);
        state.size = "half";
        draw(state);
        yield sleep(150);
        state.size = "small";
        draw(state);
        yield interpvr(mainObj).to(0, 0).over(300);
    }

    interface DrawState {
        size: "small" | "half" | "full";
        filled: boolean;
        flopVisible: boolean;
    }

    function draw({ filled, flopVisible, size }: DrawState) {
        {
            boxObj.clear();
            if (filled && size === "small") {
                boxObj.beginFill(filledTint);
            }

            let width = 10;
            if (size === "half") {
                width = 30;
            }
            else if (size === "full") {
                width = 60;
            }
            boxObj.lineStyle(1, 0x000000, 1, 1).drawRect(-width / 2, -width, width, width);
        }

        flopObj.visible = flopVisible && size !== "small";
        const scale = size === "full" ? 1 : 0.5;
        flopObj.scaled(scale, scale);
        flopObj.y = size === "full" ? -80 : -73;
    }

    draw({ filled: count > 0, flopVisible: false, size: "small" });

    const methods = {
        updateCount,
    };

    const obj = container(mainObj).merge({ methods });

    return obj;
}
