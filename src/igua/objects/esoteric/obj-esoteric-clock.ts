import { Graphics, Sprite } from "pixi.js";
import { Tx } from "../../../assets/textures";
import { Integer } from "../../../lib/math/number-alias-types";
import { container } from "../../../lib/pixi/container";

interface ObjEsotericClockArgs {
    time: {
        hours: Integer;
        minutes: Integer;
    };
}

export function objEsotericClock(args: ObjEsotericClockArgs) {
    const api = {
        ...args.time,
    };

    return container(
        Sprite.from(Tx.Esoteric.ClockFace40px)
            .anchored(0.5, 0.5),
        new Graphics()
            .beginFill(0x0000ff)
            .drawRect(-1, -1, 3, 18)
            .step(self => self.angle = (api.minutes / 60) * 360 - 180),
        new Graphics()
            .beginFill(0xff0000)
            .drawRect(-1, -1, 3, 10)
            .step(self => self.angle = (api.hours / 12) * 360 - 180),
    )
        .merge({ objEsotericClock: api });
}
