import { Rng } from "../../lib/math/rng";
import { VectorSimple } from "../../lib/math/vector-type";
import { container } from "../../lib/pixi/container";
import { mxnNudgeAppear } from "../mixins/mxn-nudge-appear";
import { RpgEconomy } from "../rpg/rpg-economy";
import { ObjValuable, objValuable } from "./obj-valuable";

// TODO does this need to be an object?
export function objValuableSpawner(positions: VectorSimple[]) {
    let collectedCount = 0;
    let currentSize = 0;
    const valuables: Array<ObjValuable | null> = [];

    return container()
        .merge({
            spawn(kind: RpgEconomy.Valuables.Kind, strategy: "first" | "random" = "random") {
                let index = -1;
                if (valuables.length < positions.length) {
                    index = valuables.length;
                }
                else if (strategy === "first") {
                    index = valuables.findIndex(item => item === null);
                }
                else {
                    const offset = Rng.int(positions.length);
                    for (let i = 0; i < positions.length; i++) {
                        const indexToCheck = (offset + i) % positions.length;
                        if (!valuables[indexToCheck]) {
                            index = indexToCheck;
                            break;
                        }
                    }
                }

                if (index === -1) {
                    return false;
                }

                const valuableObj = objValuable(kind).mixin(mxnNudgeAppear).handles(
                    "collected",
                    () => collectedCount++,
                )
                    .on("destroyed", () => {
                        if (valuables[index] === valuableObj) {
                            valuables[index] = null;
                            currentSize--;
                        }
                    });

                valuables[index] = valuableObj.at(positions[index]).show();
                currentSize++;

                return true;
            },
            get collectedCount() {
                return collectedCount;
            },
            get isFull() {
                return currentSize >= positions.length;
            },
        });
}
