import { Graphics } from "pixi.js";
import { objText } from "../../../assets/fonts";
import { interpr } from "../../../lib/game-engine/routines/interp";
import { sleep } from "../../../lib/game-engine/routines/sleep";
import { Integer, RgbInt } from "../../../lib/math/number-alias-types";
import { AdjustColor } from "../../../lib/pixi/adjust-color";
import { container } from "../../../lib/pixi/container";
import { range } from "../../../lib/range";
import { RpgProgress } from "../../rpg/rpg-progress";
import { objFlopCharacter, objFlopDexNumber } from "../obj-flop";

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

function darken(tint: RgbInt) {
    const { r, g, b } = AdjustColor.pixi(tint).toRgb();
    return AdjustColor.rgb(r / 2, g / 2, b / 2).toPixi();
}

function objFlopCollectionIndicatorSlot(dexNumber: Integer, count: Integer) {
    const boxObj = new Graphics().pivoted(30, 60);

    const flopObj = objFlopCharacter.fromDexNumber(dexNumber).at(-30, 0).invisible();
    flopObj.filtered(flopObj.objects.filter);
    const filledTint = flopObj.state.tint.red;

    const halfTint = darken(filledTint);

    const dexNumberObj = objFlopDexNumber(dexNumber).at(-58, -118).invisible();
    dexNumberObj.tint = filledTint;

    const smallCountObj = objText.SmallDigits("", { tint: halfTint }).anchored(1, 1).at(-23, -58).invisible();

    const mainObj = container(boxObj, flopObj, dexNumberObj, smallCountObj);

    const state: DrawState = {
        line: count > 0 ? "tint" : "black",
        filled: count > 0,
        flopVisible: false,
        size: "small",
        smallCount: count,
    };

    function* updateCount(nextCount: Integer) {
        yield interpr(mainObj, "y").to(-14).over(300);
        state.size = "half";
        draw(state);
        yield sleep(150);
        state.size = "full";
        state.filled = nextCount > 0;
        state.flopVisible = nextCount > 0;
        draw(state);
        const targetLine: DrawState["line"] = state.filled ? "tint" : "black";
        if (state.line !== targetLine) {
            yield sleep(100);
            state.line = "half";
            draw(state);
            yield sleep(200);
            state.line = targetLine;
            draw(state);
        }
        yield sleep(500);
        state.size = "half";
        draw(state);
        yield sleep(150);
        state.size = "small";
        state.smallCount = nextCount;
        draw(state);
        yield interpr(mainObj, "y").to(0).over(300);
    }

    interface DrawState {
        line: "black" | "half" | "tint";
        size: "small" | "half" | "full";
        smallCount: Integer;
        filled: boolean;
        flopVisible: boolean;
    }

    function draw({ line, filled, flopVisible, size, smallCount }: DrawState) {
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

            let lineTint = 0x000000;
            if (line === "tint") {
                lineTint = filledTint;
            }
            else if (line === "half") {
                lineTint = halfTint;
            }
            boxObj.lineStyle(1, lineTint, 1, 1).drawRect(-width / 2, -width, width, width);
        }

        flopObj.visible = flopVisible && size !== "small";
        const scale = size === "full" ? 1 : 0.5;
        flopObj.scaled(scale, scale);
        flopObj.y = size === "full" ? -80 : -73;

        const excessWidth = Math.round((boxObj.width - 12) / 2);

        if (size !== "small" && excessWidth > obj.x) {
            mainObj.x = excessWidth - obj.x;
        }
        else {
            mainObj.x = 0;
        }

        dexNumberObj.visible = size === "full";
        smallCountObj.visible = size === "small" && smallCount > 1;
        smallCountObj.text = String(smallCount);
    }

    draw(state);

    const methods = {
        updateCount,
    };

    const obj = container(mainObj).merge({ methods });

    return obj;
}
