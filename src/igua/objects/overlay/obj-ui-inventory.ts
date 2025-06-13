import { Graphics } from "pixi.js";
import { objText } from "../../../assets/fonts";
import { SubjectiveColorAnalyzer } from "../../../lib/color/subjective-color-analyzer";
import { PseudoRng } from "../../../lib/math/rng";
import { AdjustColor } from "../../../lib/pixi/adjust-color";
import { container } from "../../../lib/pixi/container";
import { range } from "../../../lib/range";
import { EquipmentInternalName, getDataEquipment } from "../../data/data-equipment";
import { RpgProgress } from "../../rpg/rpg-progress";
import { StepOrder } from "../step-order";

export function objUiInventory() {
    return objUiEquipmentLoadout();
}

function objUiEquipmentLoadout() {
    return container(...range(4).map(i => objUiEquipment(() => RpgProgress.character.equipment[i]).at(i * 36, 0)));
}

function objUiEquipment(provider: () => EquipmentInternalName | null) {
    let appliedName: EquipmentInternalName | null = null;

    const obj = container().step(maybeApply, StepOrder.BeforeCamera);

    function maybeApply() {
        const nameToApply = provider();
        if (nameToApply === appliedName) {
            return;
        }

        obj.removeAllChildren();

        if (nameToApply !== null) {
            objEquipmentRepresentation(nameToApply).show(obj);
        }

        appliedName = nameToApply;
    }

    return obj;
}

function objEquipmentRepresentation(internalName: EquipmentInternalName) {
    const props = getPlaceholderProperties(internalName);

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

// TODO placeholder until I draw sprites... I guess
function getPlaceholderProperties(internalName: EquipmentInternalName) {
    let seed = internalName.length * 698769;
    for (let i = 0; i < internalName.length; i++) {
        seed += internalName.charCodeAt(i) * 9901237 + 111 - i * 3;
    }

    prng.seed = seed;

    const backgroundTint = AdjustColor.hsv(prng.float(0, 360), prng.float(80, 100), prng.float(80, 100)).toPixi();
    const textTint = SubjectiveColorAnalyzer.getPreferredTextColor(backgroundTint);

    return {
        backgroundTint,
        textTint,
        name: getDataEquipment(internalName).name.replaceAll(printedNameSanitizeRegexp, ""),
    };
}
