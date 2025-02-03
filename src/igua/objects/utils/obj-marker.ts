import { container } from "../../../lib/pixi/container";

export function objMarker() {
    return container()
        .merge({ tint: 0x000000 })
        .track(objMarker);
}
