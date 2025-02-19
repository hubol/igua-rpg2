import { sleep } from "../../../lib/game-engine/routines/sleep";
import { Rng } from "../../../lib/math/rng";
import { VectorSimple } from "../../../lib/math/vector-type";
import { container } from "../../../lib/pixi/container";
import { objValuableSparkle } from "./obj-valuable-sparkle";

export function objFxSparkleMany(...sparkleVectors: VectorSimple[]) {
    return container()
        .coro(function* () {
            while (true) {
                for (const vector of Rng.shuffle(sparkleVectors)) {
                    yield sleep(Rng.float(500, 1000));
                    objValuableSparkle().at(vector).show();
                }
            }
        });
}
