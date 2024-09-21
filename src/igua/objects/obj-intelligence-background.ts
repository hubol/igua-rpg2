import { Color, Graphics } from "pixi.js";
import { Integer } from "../../lib/math/number-alias-types";
import { AdjustColor } from "../../lib/pixi/adjust-color";
import { RpgProgress } from "../rpg/rpg-progress";
import { approachLinear, nlerp } from "../../lib/math/number";

interface ObjIntelligenceBackgroundArgs {
    initialTint: string;
    targetTint: string;
    min: Integer;
    max: Integer;
}

export function objIntelligenceBackground({ initialTint, targetTint, min, max }: ObjIntelligenceBackgroundArgs) {
    const initialRgb = AdjustColor.pixi(toPixiColor(initialTint)).toRgb({});
    const targetRgb = AdjustColor.pixi(toPixiColor(targetTint)).toRgb({});
    const blendedRgb = { r: 0, g: 0, b: 0 };

    let factor = getLerpFactor(min, max);

    // TODO this should be extracted somewhere
    function getTint() {
        blendedRgb.r = nlerp(initialRgb.r, targetRgb.r, factor);
        blendedRgb.g = nlerp(initialRgb.g, targetRgb.g, factor);
        blendedRgb.b = nlerp(initialRgb.b, targetRgb.b, factor);
        return AdjustColor.rgb(blendedRgb.r, blendedRgb.g, blendedRgb.b).toPixi();
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

const matchPoundSign = /#/g;

// TODO does not belong here!
// I feel like it belongs in the levels template file
function toPixiColor(hex: string) {
    return Number.parseInt("0x" + hex.replace(matchPoundSign, ""));
}

function getLerpFactor(min: number, max: number) {
    return Math.min(
        1,
        Math.max(0, RpgProgress.character.attributes.intelligence - min + 1) / Math.max(1, max - min + 1),
    );
}
