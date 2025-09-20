import { Graphics } from "pixi.js";
import { sleep } from "../../../lib/game-engine/routines/sleep";
import { RgbInt } from "../../../lib/math/number-alias-types";
import { Rng } from "../../../lib/math/rng";
import { container } from "../../../lib/pixi/container";

export function objFxPuffyCloud(tint: RgbInt) {
    return container(
        objFxPuffyCloudPiece(4, tint).at(-24, 0),
        objFxPuffyCloudPiece(7, tint).at(-16, 0),
        objFxPuffyCloudPiece(10, tint).at(-2, 0),
        objFxPuffyCloudPiece(9, tint).at(8, 0),
        objFxPuffyCloudPiece(8, tint).at(16, 0),
        objFxPuffyCloudPiece(4, tint).at(24, 0),
    );
}

function objFxPuffyCloudPiece(radius: number, tint: RgbInt) {
    return new Graphics()
        .beginFill(tint)
        .drawCircle(0, 0, radius)
        .coro(function* (self) {
            while (true) {
                self.pivot.at(Rng.intc(-1, 1), Rng.intc(-1, 1));
                self.scale.set(Rng.float(0.67, 1));
                yield sleep(Rng.int(250, 750));
            }
        });
}
