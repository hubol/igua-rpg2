import { Graphics } from "pixi.js";
import { objText } from "../../assets/fonts";
import { SubjectiveColorAnalyzer } from "../../lib/color/subjective-color-analyzer";
import { PseudoRng } from "../../lib/math/rng";
import { AdjustColor } from "../../lib/pixi/adjust-color";
import { container } from "../../lib/pixi/container";
import { DataEquipment } from "../data/data-equipment";

export function objEquipmentRepresentation(equipmentId: DataEquipment.Id) {
    const props = getPlaceholderProperties(equipmentId);

    return container(
        new Graphics().beginFill(props.backgroundTint).drawRect(0, 0, 32, 32),
        objText.Medium(props.name, { tint: props.textTint, maxWidth: 32, align: "center" }).anchored(0.5, 0.5).at(
            16,
            16,
        ),
    );
}

const prng = new PseudoRng();
const printedNameSanitizeRegexp = /((Ring)|a|e|i|o|u)*/g;
const whiteSpaceRegexp = /\s+/g;

// TODO placeholder until I draw sprites... I guess
function getPlaceholderProperties(equipmentId: DataEquipment.Id) {
    let seed = equipmentId.length * 698769;
    for (let i = 0; i < equipmentId.length; i++) {
        seed += equipmentId.charCodeAt(i) * 9901237 + 111 - i * 3;
    }

    prng.seed = seed;

    const backgroundTint = AdjustColor.hsv(prng.float(0, 360), prng.float(80, 100), prng.float(80, 100)).toPixi();
    const textTint = SubjectiveColorAnalyzer.getPreferredTextColor(backgroundTint);

    return {
        backgroundTint,
        textTint,
        name: DataEquipment.getById(equipmentId).name
            .replaceAll(printedNameSanitizeRegexp, "")
            .replaceAll(whiteSpaceRegexp, " ")
            .trim(),
    };
}
