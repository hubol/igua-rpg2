import { sleep } from "../../../lib/game-engine/routines/sleep";
import { Rng } from "../../../lib/math/rng";
import { VectorSimple } from "../../../lib/math/vector-type";
import { container } from "../../../lib/pixi/container";
import { objValuableSparkle } from "./obj-valuable-sparkle";

export function objFxSparkleMany(...sparkleVectors: VectorSimple[]) {
    return container()
        .merge({ sparkleVectors })
        .coro(function* (self) {
            while (true) {
                yield () => self.sparkleVectors.length > 0;
                for (const vector of Rng.shuffle(self.sparkleVectors)) {
                    yield sleep(Rng.float(500, 1000));
                    objValuableSparkle().at(vector).show();
                }
            }
        });
}
