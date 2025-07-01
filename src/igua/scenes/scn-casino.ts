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
    peanut: {
        identity: "fixed",
        prizeCondition: "line_from_left_consecutive",
        countsToPrize: [0, 0, 3, 7],
    },
    cherry: {
        identity: "fixed",
        prizeCondition: "line_from_left_consecutive",
        countsToPrize: [0, 0, 4, 8],
    },
    seven: {
        identity: "fixed",
        prizeCondition: "line_from_left_consecutive",
        countsToPrize: [0, 0, 25, 100],
    },
    bar: {
        identity: "fixed",
        prizeCondition: "line_from_left_consecutive",
        countsToPrize: [0, 0, 5, 14],
    },
    wild: {
        identity: "wild",
        prizeCondition: "line_from_left_consecutive",
        countsToPrize: [0, 0, 0, 150],
    },
} satisfies Record<string, RpgSlotMachine.Symbol>;

const rules: RpgSlotMachine.Rules = {
    height: 3,
    lines: [
        [0, 0, 0, 0],
        [1, 1, 1, 1],
        [2, 2, 2, 2],
        [0, 1, 1, 0],
        [2, 1, 1, 2],
        [1, 2, 2, 1],
        [1, 0, 0, 1],
    ],
    reels: [
        [
            sym.bar,
            sym.bar,
            sym.peanut,
            sym.peanut,
            sym.peanut,
            sym.seven,
            sym.wild,
            sym.wild,
            sym.wild,
            sym.cherry,
            sym.bar,
            sym.cherry,
            sym.cherry,
            sym.seven,
            sym.seven,
            sym.seven,
            sym.cherry,
            sym.cherry,
            sym.cherry,
            sym.bar,
        ],
        [
            sym.bar,
            sym.seven,
            sym.cherry,
            sym.cherry,
            sym.peanut,
            sym.peanut,
            sym.peanut,
            sym.wild,
            sym.wild,
            sym.wild,
            sym.cherry,
            sym.seven,
            sym.bar,
            sym.bar,
            sym.seven,
            sym.seven,
            sym.seven,
            sym.cherry,
            sym.seven,
            sym.bar,
            sym.bar,
            sym.bar,
            sym.peanut,
            sym.peanut,
            sym.peanut,
            sym.bar,
            sym.bar,
            sym.cherry,
            sym.cherry,
            sym.cherry,
            sym.bar,
            sym.bar,
            sym.peanut,
            sym.peanut,
            sym.peanut,
        ],
        [
            sym.peanut,
            sym.peanut,
            sym.peanut,
            sym.bar,
            sym.bar,
            sym.bar,
            sym.cherry,
            sym.cherry,
            sym.cherry,
            sym.seven,
            sym.seven,
            sym.seven,
            sym.bar,
            sym.bar,
            sym.bar,
            sym.wild,
            sym.wild,
            sym.wild,
            sym.bar,
        ],
        [
            sym.peanut,
            sym.peanut,
            sym.peanut,
            sym.bar,
            sym.bar,
            sym.bar,
            sym.wild,
            sym.wild,
            sym.wild,
            sym.cherry,
            sym.cherry,
            sym.cherry,
            sym.seven,
            sym.seven,
            sym.seven,
        ],
    ],
};

const txs = Tx.Casino.Slots.Test.split({ width: 58 });

const symbolTxs = new Map<RpgSlotMachine.Symbol, Texture>();
symbolTxs.set(sym.peanut, txs[0]);
symbolTxs.set(sym.cherry, txs[1]);
symbolTxs.set(sym.seven, txs[2]);
symbolTxs.set(sym.bar, txs[3]);
symbolTxs.set(sym.wild, txs[4]);

export function scnCasino() {
    scene.style.backgroundTint = 0x1c1336;
    objSlotMachineSimulator(5, rules).show();
    objSlot().at(160, -30).show();
}

function objSlot() {
    const reelObjs = rules.reels.map((reel, i) =>
        objReel({ reel, height: rules.height, symbolPadding: 2 }).at(i * 65, 0)
    );
    const maskObj = new Graphics().beginFill(0xffffff).drawRect(0, 116, 65 * 4, 65 * 3 + 24);
    const reelObj = container(...reelObjs, maskObj).masked(maskObj);
    reelObj.scaled(0.8, 0.8).at(0, -50);
    const textObj = container().at(0, 50);

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
                const coros: Coro.Predicate[] = [];

                for (let i = 0; i < reelOffsets.length; i++) {
                    const controls = reelObjs[i].controls;
                    controls.offsetDelta = 0;
                    coros.push(interp(controls, "offset").factor(factor.sine).to(reelOffsets[i]).over(250));
                }
                yield* Coro.all(coros);
            }

            textObj.removeAllChildren();
            objText.Large(`Prize: ${totalPrize}`).at(58 * 1.5, 58 * 3.2).show(textObj);
            if (linePrizes.length) {
                objText.Medium(`${linePrizes.map(({ index, prize }) => `Line ${index + 1} pays ${prize}`).join("\n")}`)
                    .at(58 * 1.5, 58 * 3.8).show(textObj);

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
    reel: RpgSlotMachine.Reel;
    height: Integer;
    symbolPadding: Integer;
}

function objReel(args: ObjReelArgs) {
    const reelLength = args.reel.length;

    const controls = { offset: 0, offsetDelta: 0 };
    const gap = 65;

    const symbolObjs = range(args.height + args.symbolPadding * 2).map((i) => Sprite.from(txs[0]).at(0, i * gap));

    const state = {
        slotPositions: range(args.height).map(i => vnew(29, (i + args.symbolPadding - 0.5) * gap)),
    };

    return container(...symbolObjs)
        .merge({ controls, state })
        .step(self => {
            controls.offset = cyclic(controls.offset + controls.offsetDelta, 0, reelLength);
            self.pivot.y = Math.round((controls.offset % 1) * gap);

            const reelIndexOffset = -args.symbolPadding + Math.floor(controls.offset);
            for (let i = 0; i < symbolObjs.length; i++) {
                const reelIndex = cyclic(i + reelIndexOffset, 0, reelLength);
                const symbol = args.reel[reelIndex];
                const tx = symbolTxs.get(symbol);
                if (tx) {
                    symbolObjs[i].texture = tx;
                }
                else {
                    symbolObjs[i].visible = false;
                }
            }
        });
}

type ObjReel = ReturnType<typeof objReel>;

const p = new Point();

function objLineHighlighter(reelObjs: ObjReel[], transform: Matrix) {
    let line: RpgSlotMachine.Line | null = null;

    const controls = {
        set line(value: typeof line) {
            line = value;
            gfx.clear();

            if (!line) {
                return;
            }

            gfx.lineStyle({ cap: LINE_CAP.ROUND, color: 0xff0000, width: 10 });

            for (let xIndex = 0; xIndex < line.length; xIndex++) {
                const yIndex = line[xIndex];
                const reelObj = reelObjs[xIndex];
                const point = transform.apply(reelObj.vcpy().add(reelObj.state.slotPositions[yIndex]), p);
                gfx[xIndex === 0 ? "moveTo" : "lineTo"](point.x, point.y);
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
