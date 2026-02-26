import { Graphics, LINE_CAP, Matrix, Sprite, Texture } from "pixi.js";
import { objText } from "../../assets/fonts";
import { Coro } from "../../lib/game-engine/routines/coro";
import { factor, interp } from "../../lib/game-engine/routines/interp";
import { sleep } from "../../lib/game-engine/routines/sleep";
import { cyclic } from "../../lib/math/number";
import { Integer } from "../../lib/math/number-alias-types";
import { Rng } from "../../lib/math/rng";
import { vnew } from "../../lib/math/vector-type";
import { container } from "../../lib/pixi/container";
import { range } from "../../lib/range";
import { DramaWallet } from "../drama/drama-wallet";
import { show } from "../drama/show";
import { Cutscene } from "../globals";
import { mxnInteract } from "../mixins/mxn-interact";
import { Rpg } from "../rpg/rpg";
import { RpgEconomy } from "../rpg/rpg-economy";
import { RpgSlotMachine } from "../rpg/rpg-slot-machine";

interface SlotMachineRenderConfig {
    mask: {
        y: Integer;
        height: Integer;
    };
    reel: {
        gap: Integer;
    };
    slot: {
        gap: Integer;
    };
    symbolTxs: Map<RpgSlotMachine.Symbol, Texture>;
}

export function objSlotMachine(rules: RpgSlotMachine.Rules, config: SlotMachineRenderConfig) {
    const fallbackSymbolTx = [...config.symbolTxs.values()][0];
    const pricePerSpin: RpgEconomy.Offer = { currency: "valuables", price: rules.price };

    const reelObjs = rules.reels.map((reel, i) =>
        objReel({ config, reel, rules }, fallbackSymbolTx).at(i * config.reel.gap, -symbolPadding * config.slot.gap)
    );

    const maskObj = new Graphics().beginFill(0xffffff).drawRect(
        0,
        config.mask.y,
        config.reel.gap * (rules.reels.length + 1),
        config.mask.height,
    );
    const reelObj = container(...reelObjs, maskObj).masked(maskObj);
    const resultsObj = container();

    const api = {
        get rules() {
            return rules;
        },
        paidForGame: false,
        get pricePerSpin() {
            return pricePerSpin;
        },
        fastSpinRequested: false,
    };

    return container(reelObj, resultsObj)
        .merge({ objSlotMachine: api })
        .dispatches<"objSlotMachine.gameStarted">()
        .dispatches<"objSlotMachine.fastSpinOpportunityEnded">()
        .dispatchesValue<"objSlotMachine.gameEnded", RpgSlotMachine.SpinResult>()
        .dispatchesValue<"objSlotMachine.showLinePrize", RpgSlotMachine.SpinResult.LinePrize>()
        .coro(function* (self) {
            while (true) {
                yield () => api.paidForGame;

                resultsObj.removeAllChildren();
                self.dispatch("objSlotMachine.gameStarted");

                const spinResult = RpgSlotMachine.spin(rules);
                const { totalPrize, reelOffsets, linePrizes } = spinResult;

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

                yield* Coro.race([
                    spinReels(),
                    () => api.fastSpinRequested,
                ]);

                self.dispatch("objSlotMachine.fastSpinOpportunityEnded");

                if (api.fastSpinRequested) {
                    const coros: Coro.Type[] = [];

                    for (let i = 0; i < reelOffsets.length; i++) {
                        const controls = reelObjs[i].controls;
                        const targetOffset = reelOffsets[i];
                        coros.push(
                            Coro.chain([
                                Coro.race([
                                    () =>
                                        controls.offset < targetOffset || Math.abs(controls.offset - targetOffset) < 1,
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

                self.dispatch("objSlotMachine.gameEnded", spinResult);

                if (linePrizes.length) {
                    objLineHighlighter(reelObjs, reelObj.localTransform).coro(function* (highlighterObj) {
                        while (true) {
                            for (const prize of linePrizes) {
                                self.dispatch("objSlotMachine.showLinePrize", prize);
                                highlighterObj.controls.line = rules.lines[prize.index];
                                yield sleep(1000);
                                highlighterObj.controls.line = null;
                                yield sleep(500);
                            }
                        }
                    })
                        .show(resultsObj);
                }

                if (totalPrize > 0) {
                    self.coro(function* () {
                        yield* DramaWallet.rewardValuables(totalPrize, "gambling");
                    });
                }

                api.paidForGame = false;
            }
        });
}

export type ObjSlotMachine = ReturnType<typeof objSlotMachine>;

interface ObjReelArgs {
    config: SlotMachineRenderConfig;
    reel: RpgSlotMachine.Reel;
    rules: RpgSlotMachine.Rules;
}

const symbolPadding = 2;

function objReel(args: ObjReelArgs, fallbackSymbolTx: Texture) {
    // Before, height and width came from slot config. I am not totally sure why.
    const { width, height } = fallbackSymbolTx;
    const { gap } = args.config.slot;

    const reelLength = args.reel.length;

    const controls = { offset: 0, offsetDelta: 0 };

    const symbolObjs = range(args.rules.height + symbolPadding * 2)
        .map((i) => new Sprite().at(0, i * gap));

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
                const tx = args.config.symbolTxs.get(symbol);
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
