import { Graphics } from "pixi.js";
import { container } from "../../lib/pixi/container";
import { Force } from "../../lib/types/force";
import { approachLinear } from "../../lib/math/number";

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

enum AdjustmentDigitSize {
    Small,
    Medium,
}

interface AdjustmentConfig {
    tintBar: number;
    digit?: {
        tint: number;
        size: AdjustmentDigitSize;
        signed: boolean;
    }
}

function roundInformatively(value: number, maximum: number) {
    if (value <= 0)
        return 0;
    if (value >= maximum)
        return maximum;
    return Math.max(1, Math.min(Math.round(value), maximum - 1));
}

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
            life: 15,
        }
    }

    const createIncreaseChunk = (index: number, value: number) => {
        return {
            tint: config.increases[index].tintBar,
            value,
        }
    }

    const decreaseChunks: ReturnType<typeof createDecreaseChunk>[] = [];
    const increaseChunks: ReturnType<typeof createIncreaseChunk>[] = [];

    const c = container(barsGfx)
    .merge({
        maxValue: config.maxValue,
        width: config.width,
        tintFront: config.tintFront,
        decrease(value: number, delta: number, index: number) {
            decreaseChunks.push(createDecreaseChunk(index, trueValue, value));
            trueValue = value;
            frontValue = Math.min(frontValue, trueValue);
        },
        increase(value: number, delta: number, index: number) {
            trueValue = value;
            increaseChunks.unshift(createIncreaseChunk(index, value));
            for (const chunk of decreaseChunks) {
                chunk.value = Math.min(chunk.value, trueValue);
            }
        }
    })
    .step(() => {
        const width = c.width;
        const height = config.height;

        valuePerPixel = c.maxValue / width;
        frontValue = approachLinear(frontValue, trueValue, valuePerPixel);

        barsGfx.clear();
        barsGfx.beginFill(config.tintBack).drawRect(0, 0, width, height);

        {
            let i = 0;
            let shift = 0;

            while (i < decreaseChunks.length) {
                const chunk = decreaseChunks[i];

                chunk.life -= 1;
                if (chunk.life <= 0 && i === 0)
                    chunk.value = approachLinear(chunk.value, chunk.target, valuePerPixel);
                if (chunk.value <= chunk.target || chunk.value <= trueValue) {
                    i += 1;
                    shift += 1;
                    continue;
                }

                barsGfx.beginFill(chunk.tint).drawRect(0, 0, roundInformatively((chunk.value / c.maxValue) * width, width), height);

                if (shift)
                    decreaseChunks[i - shift] = chunk;
                i += 1;
            }

            if (shift)
                decreaseChunks.length -= shift;
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

                barsGfx.beginFill(chunk.tint).drawRect(0, 0, roundInformatively((chunk.value / c.maxValue) * width, width), height);

                if (shift)
                    increaseChunks[i - shift] = chunk;
                i += 1;
            }

            if (shift)
                increaseChunks.length -= shift;
        }

        barsGfx.beginFill(c.tintFront).drawRect(0, 0, roundInformatively((frontValue / c.maxValue) * width, width), height);
    })

    return c;
}