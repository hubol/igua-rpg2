import { Graphics, Sprite, Texture } from "pixi.js";
import { container } from "../../../lib/pixi/container";
import { Force } from "../../../lib/types/force";
import { approachLinear } from "../../../lib/math/number";
import { objText } from "../../../assets/fonts";
import { Tx } from "../../../assets/textures";
import { TextureProcessing } from "../../../lib/pixi/texture-processing";
import { Undefined } from "../../../lib/types/undefined";

interface ObjStatusBarConfig {
    value: number;
    maxValue: number;
    tintFront: number;
    tintBack: number;
    width: number;
    height: number;
    increases: AdjustmentConfig[];
    decreases: AdjustmentConfig[];
}

type AdjustmentDigitSize = "small" | "medium";
type AdjustmentDigitAlign = "left" | "right";

interface AdjustmentConfig {
    tintBar: number;
    digit?: AdjustmentDigitConfig;
}

interface AdjustmentDigitConfig {
    tint: number;
    size: AdjustmentDigitSize;
    signed: boolean;
    align: AdjustmentDigitAlign;
}

const Consts = {
    ShowDigitSteps: 60,
    ShowDecreaseChunkSteps: 15,
    DigitSpacePixels: 1,
};

function roundInformatively(value: number, maximum: number) {
    if (value <= 0) {
        return 0;
    }
    if (value >= maximum) {
        return maximum;
    }
    return Math.max(1, Math.min(Math.round(value), maximum - 1));
}

function createMessyTx(tx: Texture) {
    const yMaximums = TextureProcessing.getOpaquePixelsYMaximums(tx);
    return {
        tx,
        yMaximums,
    };
}

type MessyTx = ReturnType<typeof createMessyTx>;

const messyTxs: Record<number, MessyTx> = {
    9: createMessyTx(Tx.Ui.HorizontalBar9),
};

export function objStatusBar(config: ObjStatusBarConfig) {
    let frontValue = config.value;
    let trueValue = config.value;

    let valuePerPixel = Force<number>();

    const barsGfx = new Graphics();

    const createDecreaseChunk = (index: number, value: number, target: number) => {
        return {
            tint: config.decreases[index].tintBar,
            value,
            target,
            life: Consts.ShowDecreaseChunkSteps,
        };
    };

    const createIncreaseChunk = (index: number, value: number) => {
        return {
            tint: config.increases[index].tintBar,
            value,
        };
    };

    const decreaseChunks: ReturnType<typeof createDecreaseChunk>[] = [];
    const increaseChunks: ReturnType<typeof createIncreaseChunk>[] = [];

    const createText = (digit: AdjustmentDigitConfig, isPositiveSign: boolean) => {
        let life = 0;
        let value = 0;
        const text = objText[digit.size === "small" ? "Small" : "MediumDigits"]("0", { tint: digit.tint })
            .anchored(digit.align === "left" ? 0 : 1, 1)
            .merge({
                addDelta(delta: number) {
                    value += delta;

                    if (digit.signed) {
                        text.text = (isPositiveSign ? "+" : "-") + Math.round(value);
                    }
                    else {
                        text.text = "" + Math.round(value);
                    }

                    life = Consts.ShowDigitSteps;
                    text.visible = true;
                },
                clear() {
                    life = 0;
                    text.visible = false;
                    value = 0;
                },
            })
            .step(self => {
                if (life > 0) {
                    life--;
                }
                self.visible = life > 0;
                if (!self.visible) {
                    value = 0;
                }
            }, -1);

        text.visible = false;

        (digit.align === "left" ? leftAlignedTexts : rightAlignedTexts).push(text);

        return text;
    };

    const leftAlignedTexts: ReturnType<typeof createText>[] = [];
    const rightAlignedTexts: ReturnType<typeof createText>[] = [];

    const messyTx = Undefined(messyTxs[config.height]);

    const getTextFloor = messyTx
        ? (x: number) => messyTx.yMaximums[x] === null ? messyTx.tx.height : (messyTx.yMaximums[x]! + 1)
        : () => config.height;

    const c = container(barsGfx)
        .merge({
            stepsSinceChange: 0,
            maxValue: config.maxValue,
            width: config.width,
            tintFront: config.tintFront,
            decrease(value: number, delta: number, index: number) {
                c.stepsSinceChange = 0;
                decreaseChunks.push(createDecreaseChunk(index, trueValue, value));
                trueValue = value;
                frontValue = Math.min(frontValue, trueValue);
                decreaseTexts[index]?.addDelta(delta);
            },
            increase(value: number, delta: number, index: number) {
                c.stepsSinceChange = 0;
                trueValue = value;
                increaseChunks.unshift(createIncreaseChunk(index, value));
                for (const chunk of decreaseChunks) {
                    chunk.value = Math.min(chunk.value, trueValue);
                }
                increaseTexts[index]?.addDelta(delta);
            },
        })
        .step(() => {
            c.stepsSinceChange++;
            const width = c.width;
            const height = config.height;

            valuePerPixel = c.maxValue / width;
            frontValue = approachLinear(frontValue, trueValue, valuePerPixel);

            barsGfx.clear();
            barsGfx.beginFill(config.tintBack).drawRect(0, 0, width, height);

            {
                let x = 1;
                for (let i = 0; i < leftAlignedTexts.length; i++) {
                    const text = leftAlignedTexts[i];
                    text.at(x, getTextFloor(x));
                    if (text.visible) {
                        x += text.width + Consts.DigitSpacePixels;
                    }
                }
            }

            {
                let x = width;
                for (let i = 0; i < rightAlignedTexts.length; i++) {
                    const text = rightAlignedTexts[i];
                    text.at(x, getTextFloor(x));
                    if (text.visible) {
                        x -= text.width + Consts.DigitSpacePixels;
                    }
                }
            }

            {
                let i = 0;
                let shift = 0;

                while (i < decreaseChunks.length) {
                    const chunk = decreaseChunks[i];

                    chunk.life -= 1;
                    if (chunk.life <= 0 && i === 0) {
                        chunk.value = approachLinear(chunk.value, chunk.target, valuePerPixel);
                    }
                    if (chunk.value <= chunk.target || chunk.value <= trueValue) {
                        i += 1;
                        shift += 1;
                        continue;
                    }

                    barsGfx.beginFill(chunk.tint).drawRect(
                        0,
                        0,
                        roundInformatively((chunk.value / c.maxValue) * width, width),
                        height,
                    );

                    if (shift) {
                        decreaseChunks[i - shift] = chunk;
                    }
                    i += 1;
                }

                if (shift) {
                    decreaseChunks.length -= shift;
                }
            }

            {
                let i = 0;
                let shift = 0;

                while (i < increaseChunks.length) {
                    const chunk = increaseChunks[i];

                    chunk.value = Math.min(chunk.value, trueValue);

                    if (chunk.value <= frontValue) {
                        i += 1;
                        shift += 1;
                        continue;
                    }

                    barsGfx.beginFill(chunk.tint).drawRect(
                        0,
                        0,
                        roundInformatively((chunk.value / c.maxValue) * width, width),
                        height,
                    );

                    if (shift) {
                        increaseChunks[i - shift] = chunk;
                    }
                    i += 1;
                }

                if (shift) {
                    increaseChunks.length -= shift;
                }
            }

            barsGfx.beginFill(c.tintFront).drawRect(
                0,
                0,
                roundInformatively((frontValue / c.maxValue) * width, width),
                height,
            );
        });

    // TODO kind of a hack for the new messy style
    if (config.height === 9) {
        barsGfx.mask = Sprite.from(Tx.Ui.HorizontalBar9).show(c);
    }

    const increaseTexts = config.increases.map(x => x.digit ? createText(x.digit, true).show(c) : null);
    const decreaseTexts = config.decreases.map(x => x.digit ? createText(x.digit, false).show(c) : null);

    return c;
}

export type ObjStatusBar = ReturnType<typeof objStatusBar>;
