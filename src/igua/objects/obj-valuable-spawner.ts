import { VectorSimple } from "../../lib/math/vector-type";
import { container } from "../../lib/pixi/container";
import { ObjValuable, objValuable } from "./obj-valuable";

// TODO does this need to be an object?
export function objValuableSpawner(positions: VectorSimple[]) {
    let collectedCount = 0;
    let currentSize = 0;
    const valuables: Array<ObjValuable | null> = [];

    return container()
        .merge({
            // TODO support type passed in
            spawn() {
                let index = -1;
                if (valuables.length < positions.length) {
                    index = valuables.length;
                }
                else {
                    index = valuables.findIndex(item => item === null);
                }

                if (index === -1) {
                    return false;
                }

                // TODO orange from arg
                const valuableObj = objValuable("orange").handles("collected", () => collectedCount++)
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
