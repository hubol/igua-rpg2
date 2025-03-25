import { Graphics } from "pixi.js";
import { Integer, RgbInt } from "../../../lib/math/number-alias-types";
import { IRectangle } from "../../../lib/math/rectangle";
import { Empty } from "../../../lib/types/empty";

interface Weight {
    tint: RgbInt;
    value: Integer;
}

interface ObjUiSubdividedBarArgs {
    height: Integer;
    width: Integer;
    tint: RgbInt;
    weights: Weight[];
}

export function objUiSubdividedBar(args: ObjUiSubdividedBarArgs) {
    return new Graphics()
        .merge({ renderedWeights: Empty<IRectangle>() })
        .step(self => {
            let totalWeight = 0;
            let nonZeroCount = 0;

            for (let i = 0; i < args.weights.length; i++) {
                if (!self.renderedWeights[i]) {
                    self.renderedWeights[i] = { x: 0, y: 0, width: 0, height: 0 };
                }

                const weight = args.weights[i].value;
                if (weight > 0) {
                    totalWeight += weight;
                    nonZeroCount++;
                }
            }

            if (nonZeroCount === 0) {
                return;
            }

            const effectiveAvailableWidth = args.width - nonZeroCount;

            let nextX = 0;
            let maxWidth = args.width;
            let remainingNonZeroCount = nonZeroCount;

            for (let i = 0; i < args.weights.length; i++) {
                const weight = args.weights[i].value;

                const r = self.renderedWeights[i];
                r.x = nextX;
                r.y = 0;
                r.height = args.height;

                if (weight <= 0) {
                    r.width = 0;
                    continue;
                }

                remainingNonZeroCount--;

                r.width = remainingNonZeroCount === 0 ? maxWidth : Math.min(
                    maxWidth,
                    1 + Math.round((weight / totalWeight) * effectiveAvailableWidth),
                );

                nextX += r.width;
                maxWidth = Math.max(maxWidth - r.width, 0);
            }
        })
        .step(self => {
            self.clear().beginFill(args.tint).drawRect(0, 0, args.width, args.height);
            for (let i = 0; i < args.weights.length; i++) {
                const rectangle = self.renderedWeights[i];

                if (rectangle.width > 0) {
                    self.beginFill(args.weights[i].tint).drawRect(
                        rectangle.x,
                        rectangle.y,
                        rectangle.width,
                        rectangle.height,
                    );
                }
            }
        });
}
