import { Graphics } from "pixi.js";
import { container } from "../../../lib/pixi/container";

export function objCirclebox() {
    return container(
        new Graphics().beginFill(0xff0000).drawRect(-0.9, -0.3, 1.8, 0.6),
        new Graphics().beginFill(0xff0000).drawRect(-0.65, -0.65, 1.3, 1.3),
        new Graphics().beginFill(0xff0000).drawRect(-0.3, -0.9, 0.6, 1.8),
    )
        .invisible();
}
