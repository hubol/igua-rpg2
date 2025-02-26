import { Instances } from "../../../../lib/game-engine/instances";
import { SceneLocal } from "../../../../lib/game-engine/scene-local";
import { VectorSimple } from "../../../../lib/math/vector-type";
import { container } from "../../../../lib/pixi/container";
import { objFxSparkleMany } from "../obj-fx-sparkle-many";

const CtxEnvironmentFxSparkleMany = new SceneLocal(() => {
    const sparkleVectors: VectorSimple[] = [];

    return objFxSparkleMany()
        .merge({
            get sparkleVectors() {
                sparkleVectors.length = 0;
                sparkleVectors.push(...Instances(objEnvironmentFxSparkle));
                return sparkleVectors;
            },
        })
        .show();
}, "CtxEnvironmentFxSparkleMany");

export function objEnvironmentFxSparkle() {
    CtxEnvironmentFxSparkleMany.value;
    return container().track(objEnvironmentFxSparkle);
}
