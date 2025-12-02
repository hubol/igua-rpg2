import { Graphics, LINE_CAP, Matrix, Sprite, Texture } from "pixi.js";
import { objText } from "../../assets/fonts";
import { Lvl } from "../../assets/generated/levels/generated-level-data";
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
import { DataSlotMachines } from "../data/data-slot-machines";
import { Input, scene } from "../globals";
import { objAngelSnail } from "../objects/enemies/obj-angel-snail";
import { playerObj } from "../objects/obj-player";
import { RpgSlotMachine } from "../rpg/rpg-slot-machine";

const { rules, sym } = DataSlotMachines.BasicThreeReel;

const txs = Tx.Casino.Slots.Test.split({ width: 58 });

const symbolTxs = new Map<RpgSlotMachine.Symbol, Texture>();
// symbolTxs.set(// sym.peanut, txs[0]);
symbolTxs.set(sym.cherry, txs[1]);
symbolTxs.set(sym.seven, txs[2]);
symbolTxs.set(sym.bar, txs[3]);
symbolTxs.set(sym.wild, txs[4]);

export function scnCasino() {
    Lvl.Dummy();
    scene.style.backgroundTint = 0x1c1336;
    objSlot(rules, { reel: { gap: 90 }, slot: { gap: 50, width: 65, height: 65 } }).at(160, 30).show();
    objAngelSnail().at(playerObj).add(0, -32).show();
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
