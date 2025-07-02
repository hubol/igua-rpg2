import { Graphics, LINE_CAP, Matrix, Point, Sprite, Texture } from "pixi.js";
import { objText } from "../../assets/fonts";
import { Tx } from "../../assets/textures";
import { Coro } from "../../lib/game-engine/routines/coro";
import { factor, interp } from "../../lib/game-engine/routines/interp";
import { sleep } from "../../lib/game-engine/routines/sleep";
import { cyclic } from "../../lib/math/number";
import { Integer } from "../../lib/math/number-alias-types";
import { Rng } from "../../lib/math/rng";
import { vnew } from "../../lib/math/vector-type";
import { container } from "../../lib/pixi/container";
import { range } from "../../lib/range";
import { Input, scene } from "../globals";
import { RpgSlotMachine } from "../rpg/rpg-slot-machine";

const sym = {
    empty: {
        identity: "fixed",
        prizeCondition: "line_from_left_consecutive",
        countsToPrize: [0, 0, 0],
    },
    peanut: {
        identity: "fixed",
        prizeCondition: "line_from_left_consecutive",
        countsToPrize: [0, 0, 10],
    },
    bar: {
        identity: "fixed",
        prizeCondition: "line_from_left_consecutive",
        countsToPrize: [0, 0, 10],
    },
    cherry: {
        identity: "fixed",
        prizeCondition: "line_from_left_consecutive",
        countsToPrize: [0, 0, 25],
    },
    seven: {
        identity: "fixed",
        prizeCondition: "line_from_left_consecutive",
        countsToPrize: [0, 0, 100],
    },
    wild: {
        identity: "wild",
        prizeCondition: "line_from_left_consecutive",
        countsToPrize: [0, 0, 500],
    },
} satisfies Record<string, RpgSlotMachine.Symbol>;

function interlace<T>(array: T[], item: T): T[] {
    const result: T[] = [];
    for (let i = 0; i < array.length; i++) {
        result.push(array[i], item);
    }

    return result;
}

const rules: RpgSlotMachine.Rules = {
    height: 3,
    lines: [
        [0, 0, 0],
        [1, 1, 1],
        [2, 2, 2],
    ],
    reels: [
        interlace([
            // sym.peanut,
            // sym.peanut,
            sym.bar,
            sym.cherry,
            sym.cherry,
            sym.seven,
            // sym.peanut,
            sym.cherry,
            sym.cherry,
            // sym.peanut,
            sym.bar,
            sym.bar,
            // sym.peanut,
            sym.seven,
            sym.seven,
            sym.wild,
            sym.wild,
        ], sym.empty),
        interlace([
            // sym.peanut,
            // sym.peanut,
            sym.cherry,
            // sym.peanut,
            // sym.peanut,
            sym.cherry,
            sym.cherry,
            sym.bar,
            sym.bar,
            sym.seven,
            sym.seven,
            sym.bar,
            sym.wild,
            sym.wild,
        ], sym.empty),
        interlace([
            // sym.peanut,
            // sym.peanut,
            sym.cherry,
            sym.cherry,
            sym.bar,
            sym.bar,
            sym.cherry,
            sym.seven,
            sym.seven,
            sym.bar,
            // sym.peanut,
            sym.wild,
            sym.wild,
        ], sym.empty),
    ],
};

const txs = Tx.Casino.Slots.Test.split({ width: 58 });

const symbolTxs = new Map<RpgSlotMachine.Symbol, Texture>();
// symbolTxs.set(// sym.peanut, txs[0]);
symbolTxs.set(sym.cherry, txs[1]);
symbolTxs.set(sym.seven, txs[2]);
symbolTxs.set(sym.bar, txs[3]);
symbolTxs.set(sym.wild, txs[4]);

export function scnCasino() {
    scene.style.backgroundTint = 0x1c1336;
    objSlotMachineSimulator(5, rules).show();
    objSlot(rules, { reel: { gap: 90 }, slot: { gap: 50, width: 65, height: 65 } }).at(160, 30).show();
}

interface SlotMachineRenderConfig {
    reel: {
        gap: Integer;
    };
    slot: {
        gap: Integer;
        width: Integer;
        height: Integer;
    };
}

function objSlot(rules: RpgSlotMachine.Rules, config: SlotMachineRenderConfig) {
    const reelObjs = rules.reels.map((reel, i) =>
        objReel({ config, reel, rules }).at(i * config.reel.gap, -symbolPadding * config.slot.gap)
    );
    const maskObj = new Graphics().beginFill(0xffffff).drawRect(0, -10, config.reel.gap * 4, config.slot.gap * 3 + 40);
    const reelObj = container(...reelObjs, maskObj).masked(maskObj);
    reelObj.scaled(0.8, 0.8);
    const textObj = container();

    return container(reelObj, textObj).coro(function* () {
        while (true) {
            yield () => Input.isDown("Confirm");

            textObj.removeAllChildren();

            const { totalPrize, reelOffsets, linePrizes } = RpgSlotMachine.spin(rules);

            for (const reelObj of reelObjs) {
                reelObj.controls.offsetDelta = Rng.float(0.175, 0.3);
            }

            function* spinReels() {
                for (let i = 0; i < reelOffsets.length; i++) {
                    const offset = reelOffsets[i];
                    const reelObj = reelObjs[i];

                    yield sleep(i === 0 ? 500 : 125);

                    yield () => Math.abs(reelObj.controls.offset - offset) < 1;

                    reelObj.controls.offsetDelta = 0;
                    yield interp(reelObj.controls, "offset").factor(factor.sine).to(offset).over(Rng.int(250, 750));
                }
            }

            let fastSpin = false;

            yield* Coro.race([
                spinReels(),
                Coro.chain([() => Input.isUp("Confirm"), () => Input.isDown("Confirm"), () => fastSpin = true]),
            ]);

            if (fastSpin) {
                const coros: Coro.Type[] = [];

                for (let i = 0; i < reelOffsets.length; i++) {
                    const controls = reelObjs[i].controls;
                    const targetOffset = reelOffsets[i];
                    coros.push(
                        Coro.chain([
                            Coro.race([
                                () => controls.offset < targetOffset || Math.abs(controls.offset - targetOffset) < 1,
                                interp(controls, "offsetDelta").steps(4).to(0.9).over(500),
                            ]),
                            () => (controls.offsetDelta = 0, true),
                            interp(controls, "offset").factor(factor.sine).to(targetOffset).over(300),
                        ]),
                    );
                }
                yield* Coro.all(coros);
                yield sleep(100);
            }

            textObj.removeAllChildren();
            objText.Large(`Prize: ${totalPrize}`).at(58 * 1.5, 58 * 3.2 + 40).show(textObj);
            if (linePrizes.length) {
                objText.Medium(`${linePrizes.map(({ index, prize }) => `Line ${index + 1} pays ${prize}`).join("\n")}`)
                    .at(58 * 1.5, 58 * 3.8 + 40).show(textObj);

                objLineHighlighter(reelObjs, reelObj.localTransform).coro(function* (self) {
                    while (true) {
                        for (const prize of linePrizes) {
                            self.controls.line = rules.lines[prize.index];
                            yield sleep(1000);
                            self.controls.line = null;
                            yield sleep(500);
                        }
                    }
                }).show(textObj);
            }

            yield () => !Input.isDown("Confirm");
        }
    });
}

interface ObjReelArgs {
    config: SlotMachineRenderConfig;
    reel: RpgSlotMachine.Reel;
    rules: RpgSlotMachine.Rules;
}

const symbolPadding = 2;

function objReel(args: ObjReelArgs) {
    const { gap, width, height } = args.config.slot;

    const reelLength = args.reel.length;

    const controls = { offset: 0, offsetDelta: 0 };

    const symbolObjs = range(args.rules.height + symbolPadding * 2).map((i) => Sprite.from(txs[0]).at(0, i * gap));

    const state = {
        slotPositions: range(args.rules.height).map(i => vnew(width / 2, (i + symbolPadding) * gap + height / 2)),
    };

    return container(...symbolObjs)
        .merge({ controls, state })
        .step(self => {
            controls.offset = cyclic(controls.offset + controls.offsetDelta, 0, reelLength);
            self.pivot.y = Math.round((controls.offset % 1) * gap);

            const reelIndexOffset = -symbolPadding + Math.floor(controls.offset);
            for (let i = 0; i < symbolObjs.length; i++) {
                const reelIndex = cyclic(i + reelIndexOffset, 0, reelLength);
                const symbol = args.reel[reelIndex];
                const tx = symbolTxs.get(symbol);
                if (tx) {
                    symbolObjs[i].texture = tx;
                }
                symbolObjs[i].visible = Boolean(tx);
            }
        });
}

type ObjReel = ReturnType<typeof objReel>;

function objLineHighlighter(reelObjs: ObjReel[], transform: Matrix) {
    let line: RpgSlotMachine.Line | null = null;

    const controls = {
        set line(value: typeof line) {
            line = value;
            gfx.clear();

            if (!line) {
                return;
            }

            gfx.lineStyle({ cap: LINE_CAP.ROUND, color: 0xff0000, width: 6 });

            const slotPositions = line.map((yIndex, xIndex) => {
                const reelObj = reelObjs[xIndex];
                const v = reelObj.vcpy().add(reelObj.state.slotPositions[yIndex]);
                return transform.apply(v, v);
            });

            const distance = slotPositions[1].x - slotPositions[0].x;
            const half = distance / 2;
            const quarter = distance / 4;

            const points = [
                slotPositions[0].vcpy().add(-half, 0),
                slotPositions[0],
                slotPositions[0].vcpy().add(quarter, 0),
                ...slotPositions.slice(1, -1).flatMap(slot => [
                    slot.vcpy().add(-quarter, 0),
                    slot,
                    slot.vcpy().add(quarter, 0),
                ]),
                slotPositions.last.vcpy().add(-quarter, 0),
                slotPositions.last,
                slotPositions.last.vcpy().add(half, 0),
            ];

            for (let i = 0; i < points.length; i++) {
                const point = points[i].vround();
                gfx[i === 0 ? "moveTo" : "lineTo"](point.x, point.y);
            }
        },
    };

    const gfx = new Graphics();

    return gfx.merge({ controls });
}

function objSlotMachineSimulator(price: Integer, rules: RpgSlotMachine.Rules) {
    let spins = 0;
    let won = 0;

    let maxPrize = 0;
    const prizeCounts = new Map<Integer, Integer>();

    return objText.Medium().step(self => {
        const timeStart = Date.now();
        while (Date.now() < timeStart + 4) {
            const { totalPrize } = RpgSlotMachine.spin(rules);
            spins += 1;
            won += totalPrize;
            maxPrize = Math.max(totalPrize, maxPrize);
            prizeCounts.set(totalPrize, (prizeCounts.get(totalPrize) ?? 0) + 1);
        }

        const paid = spins * price;
        const returnToPlayer = won / paid;

        const mostFrequentPrizes = [...prizeCounts.entries()].map(([prize, count]) => ({ prize, count })).sort((a, b) =>
            b.count - a.count
        );

        self.text = `Spins: ${spins}
Paid: ${paid}
Won: ${won}
Return-to-player: ${(returnToPlayer * 100).toFixed(4)}%
Maximum prize: ${maxPrize} (${((prizeCounts.get(maxPrize)! / spins) * 100).toFixed(5)}%)
Most frequent prizes:
${
            mostFrequentPrizes.slice(0, 10).map(({ count, prize }) =>
                `${prize}: ${((count / spins) * 100).toFixed(2)}%`
            )
                .join("\n")
        }
`;
    });
}
