import { Graphics } from "pixi.js";
import { Integer } from "../../lib/math/number-alias-types";
import { RpgProgress } from "../rpg/rpg-progress";
import { approachLinear } from "../../lib/math/number";
import { StringConvert } from "../../lib/string/string-convert";
import { blendColor } from "../../lib/color/blend-color";

interface ObjIntelligenceBackgroundArgs {
    initialTint: string;
    targetTint: string;
    min: Integer;
    max: Integer;
}

export function objIntelligenceBackground({ initialTint, targetTint, min, max }: ObjIntelligenceBackgroundArgs) {
    const start = StringConvert.toRgbInt(initialTint);
    const end = StringConvert.toRgbInt(targetTint);

    let factor = getLerpFactor(min, max);

    function getTint() {
        return blendColor(start, end, factor);
    }

    return new Graphics().beginFill(0xffffff).drawRect(0, 0, 1, 1)
        .step(gfx => {
            const nextFactor = getLerpFactor(min, max);
            if (nextFactor !== factor) {
                factor = approachLinear(factor, nextFactor, 0.01);
                gfx.tint = getTint();
            }
        })
        .tinted(getTint());
}

function getLerpFactor(min: number, max: number) {
    return Math.min(
        1,
        Math.max(0, RpgProgress.character.attributes.intelligence - min + 1) / Math.max(1, max - min + 1),
    );
}
