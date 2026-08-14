import { DisplayObject } from "pixi.js";
import { vnew } from "../../lib/math/vector-type";
import { Input } from "../globals";

export function mxnInputDirectionVector(obj: DisplayObject) {
    const api = {
        current: vnew(),
    };

    return obj
        .merge({ mxnInputDirectionVector: api })
        .step(() => {
            api.current.at(0, 0);
            if (Input.isDown("MoveLeft")) {
                api.current.x -= 1;
            }
            if (Input.isDown("MoveRight")) {
                api.current.x += 1;
            }
            if (Input.isDown("WorldMap_MoveUp")) {
                api.current.y -= 1;
            }
            if (Input.isDown("WorldMap_MoveDown")) {
                api.current.y += 1;
            }
            if (!api.current.isZero) {
                api.current.vlength = 1;
            }
        });
}
