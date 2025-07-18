import { Graphics, Sprite } from "pixi.js";
import { objText } from "../../../assets/fonts";
import { Tx } from "../../../assets/textures";
import { Coro } from "../../../lib/game-engine/routines/coro";
import { interpr, interpvr } from "../../../lib/game-engine/routines/interp";
import { onMutate } from "../../../lib/game-engine/routines/on-mutate";
import { sleep } from "../../../lib/game-engine/routines/sleep";
import { Integer, RgbInt } from "../../../lib/math/number-alias-types";
import { clone } from "../../../lib/object/clone";
import { AdjustColor } from "../../../lib/pixi/adjust-color";
import { container } from "../../../lib/pixi/container";
import { range } from "../../../lib/range";
import { Rpg } from "../../rpg/rpg";
import { objFlopCharacter, objFlopDexNumber } from "../obj-flop";

const Consts = {
    rangeSize: 10,
};

export function objFlopCollectionIndicator() {
    const previous = range(999).map(index => Rpg.character.inventory.flops[index] ?? 0);

    function slicePrevious(startIndex: Integer) {
        return previous.slice(startIndex, startIndex + Consts.rangeSize);
    }

    const differenceRanges = new Map<Integer, Integer[]>();

    return container()
        .step(() => {
            for (const key in Rpg.character.inventory.flops) {
                const index = Number(key);
                const value = Rpg.character.inventory.flops[index];
                if (value !== previous[index]) {
                    const differenceRangeStartIndex = Math.floor(index / Consts.rangeSize) * Consts.rangeSize;

                    let counts = differenceRanges.get(differenceRangeStartIndex);
                    if (!counts) {
                        counts = slicePrevious(differenceRangeStartIndex);
                        differenceRanges.set(differenceRangeStartIndex, counts);
                    }

                    counts[index - differenceRangeStartIndex] = value;
                }
            }
        })
        .coro(function* (self) {
            while (true) {
                yield () => differenceRanges.size > 0;
                let range: { startIndex: Integer; counts: Integer[] } | null = null;
                for (const [startIndex, counts] of differenceRanges) {
                    range = { startIndex, counts };
                }

                if (range === null) {
                    continue;
                }

                const sliceObj = objFlopCollectionIndicatorSlice(
                    range.startIndex,
                    slicePrevious(range.startIndex),
                    range.counts,
                ).show(self);
                yield () => sliceObj.state.done;

                previous.splice(range.startIndex, Consts.rangeSize, ...range.counts);
                differenceRanges.delete(range.startIndex);

                yield () => sliceObj.destroyed;
            }
        });
}

// TODO don't show a 1000th slot!
function objFlopCollectionIndicatorSlice(startingIndex: Integer, initialCounts: Integer[], counts: Integer[]) {
    const slotObjs = initialCounts.map((count, index) =>
        objFlopCollectionIndicatorSlot(index + startingIndex, count).at(index * 14, 0)
    );

    const renderedCounts = [...initialCounts];

    const state = {
        done: false,
    };

    return container(...slotObjs)
        .merge({ state })
        .coro(function* (self) {
            yield interpvr(self).to(0, 0).over(200);

            while (!self.state.done) {
                for (let i = 0; i < counts.length; i++) {
                    if (renderedCounts[i] !== counts[i]) {
                        yield* slotObjs[i].methods.updateCount(counts[i]);
                        renderedCounts[i] = counts[i];
                    }
                }

                yield* Coro.race([
                    onMutate(counts),
                    Coro.chain([sleep(500), () => self.state.done = true]),
                ]);
            }

            yield interpvr(self).to(0, 20).over(200);
            self.destroy();
        })
        .pivoted(-36, 0)
        .at(0, 20);
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

    const countObj = objFlopCount(halfTint).at(-23, -58).invisible();

    const mainObj = container(boxObj, flopObj, dexNumberObj, countObj);

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
        countObj.visible = size === "small";
        countObj.controls.count = smallCount;
    }

    draw(state);

    const methods = {
        updateCount,
    };

    const obj = container(mainObj).merge({ methods });

    return obj;
}

function objFlopCount(tint: RgbInt) {
    const textObj = objText.SmallDigits("", { tint }).anchored(1, 1).invisible();
    const sprite = Sprite.from(Tx.Ui.FlopMax).anchored(1, 1).at(-1, -1).tinted(tint).invisible();

    const controls = {
        set count(value: Integer) {
            if (value <= 1) {
                textObj.visible = false;
                sprite.visible = false;
                return;
            }
            sprite.visible = value >= 99;
            textObj.visible = !sprite.visible;
            textObj.text = String(value);
        },
    };

    return container(textObj, sprite).merge({ controls });
}
