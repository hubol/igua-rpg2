import { Graphics, Sprite } from "pixi.js";
import { objText } from "../../../assets/fonts";
import { Tx } from "../../../assets/textures";
import { SubjectiveColorAnalyzer } from "../../../lib/color/subjective-color-analyzer";
import { Integer } from "../../../lib/math/number-alias-types";
import { PseudoRng } from "../../../lib/math/rng";
import { AdjustColor } from "../../../lib/pixi/adjust-color";
import { container } from "../../../lib/pixi/container";
import { range } from "../../../lib/range";
import { DataEquipment } from "../../data/data-equipment";

export function objFigureEquipment(equipmentId: DataEquipment.Id, level: Integer) {
    const texture = DataEquipment.getById(equipmentId).texture;

    const obj = texture ? Sprite.from(texture) : objPlaceholderEquipment(equipmentId);

    objLevelMarker(level).show(obj);

    return obj;
}

const levelTxs = Tx.Collectibles.EquipmentLevel.split({ width: 6 });

const levelConsts = {
    maxMarkers: 5,
    tints: [
        0x19A859,
        0x54BAFF,
        0x3775E8,
        0xA074E8,
        0xFF4974,
    ],
    maxTextureIndex: levelTxs.length - 1,
};

function objLevelMarker(level: Integer) {
    const { textureIndices, tintIndices } = getLevelMarkerProperties(level);

    return container(
        ...textureIndices.map((textureIndex, index) =>
            Sprite.from(levelTxs[textureIndex])
                .at(index * 6, 24 - (index % 2))
                .tinted(levelConsts.tints[tintIndices[index]])
        ),
    );
}

function getLevelMarkerProperties(level: Integer) {
    const textureIndices: Integer[] = [];

    while (--level > 0) {
        // Filled the whole buffer
        if (textureIndices.length === levelConsts.maxMarkers) {
            const lastTextureIndex = textureIndices.last;
            // We filled with the highest marker, try to increase tints!
            if (lastTextureIndex === levelConsts.maxTextureIndex) {
                break;
            }

            const firstIndexOf = textureIndices.indexOf(lastTextureIndex);
            textureIndices.length = firstIndexOf;
            textureIndices.push(lastTextureIndex + 1);
        }
        else {
            textureIndices.push(0);
        }
    }

    const tintIndices = range(levelConsts.tints.length);

    {
        const maxTintIndex = tintIndices.length - 1;
        let increaseTintIndex = textureIndices.length - 1;

        while (level > 0) {
            // Every marker has maximum tint, abort!
            if (increaseTintIndex === 0 && tintIndices[increaseTintIndex] === maxTintIndex) {
                break;
            }
            if (tintIndices[increaseTintIndex] < maxTintIndex) {
                tintIndices[increaseTintIndex] += 1;
                level -= 1;
            }
            increaseTintIndex = increaseTintIndex === 0 ? textureIndices.length - 1 : (increaseTintIndex - 1);
        }
    }

    return {
        textureIndices,
        tintIndices,
    };
}

function objPlaceholderEquipment(equipmentId: DataEquipment.Id) {
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
