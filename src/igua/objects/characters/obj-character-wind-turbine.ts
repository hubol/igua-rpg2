import { Sprite } from "pixi.js";
import { Tx } from "../../../assets/textures";
import { container } from "../../../lib/pixi/container";

const [txPost, txBlades, txFront] = Tx.Characters.WindFarm.Turbine.split({ count: 3 });

export function objCharacterWindTurbine() {
    const bladesObj = Sprite.from(txBlades);

    let angle = 0;

    const api = {
        get angle() {
            return angle;
        },
        set angle(value) {
            bladesObj.angle = Math.round(value / 15) * 15;
        },
    };

    return container(
        Sprite.from(txPost),
        bladesObj.pivoted(29, 33).at(29, 33),
        Sprite.from(txFront),
    )
        .merge({ objCharacterWindTurbine: api })
        .pivoted(29, 80);
}
