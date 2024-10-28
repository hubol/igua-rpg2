import { Polar } from "../../lib/math/number-alias-types";
import { container } from "../../lib/pixi/container";

export function objCheckpoint(checkpointName: string, facing: Polar) {
    return container()
        .merge({ facing, checkpointName })
        .named(`Checkpoint ${checkpointName}`)
        .track(objCheckpoint);
}
