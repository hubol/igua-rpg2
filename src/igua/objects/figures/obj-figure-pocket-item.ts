import { Graphics, Sprite } from "pixi.js";
import { objText } from "../../../assets/fonts";
import { SubjectiveColorAnalyzer } from "../../../lib/color/subjective-color-analyzer";
import { PseudoRng } from "../../../lib/math/rng";
import { AdjustColor } from "../../../lib/pixi/adjust-color";
import { container } from "../../../lib/pixi/container";
import { DataPocketItem } from "../../data/data-pocket-item";

export function objFigurePocketItem(pocketItemId: DataPocketItem.Id) {
    const texture = DataPocketItem.getById(pocketItemId).texture;

    if (texture) {
        return Sprite.from(texture);
    }

    const props = getPlaceholderProperties(pocketItemId);

    return container(
        new Graphics().beginFill(props.backgroundTint).moveTo(16, 0).lineTo(32, 32).lineTo(0, 32).endFill(),
        objText.XSmallIrregular(props.name, { tint: props.textTint, maxWidth: 32, align: "center" })
            .anchored(0.5, 0.5)
            .at(16, 16),
    );
}

const prng = new PseudoRng();

// TODO placeholder until I draw sprites... I guess
function getPlaceholderProperties(pocketItemId: DataPocketItem.Id) {
    let seed = pocketItemId.length * 698769;
    for (let i = 0; i < pocketItemId.length; i++) {
        seed += pocketItemId.charCodeAt(i) * 9901237 + 111 - i * 3;
    }

    prng.seed = seed;

    const backgroundTint = AdjustColor.hsv(prng.float(0, 360), prng.float(80, 100), prng.float(80, 100)).toPixi();
    const textTint = SubjectiveColorAnalyzer.getPreferredTextColor(backgroundTint);

    return {
        backgroundTint,
        textTint,
        name: DataPocketItem.getById(pocketItemId).name,
    };
}
