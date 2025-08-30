import { DisplayObject } from "pixi.js";
import { blendColor } from "../../../../lib/color/blend-color";
import { Integer, RgbInt } from "../../../../lib/math/number-alias-types";
import { Rng } from "../../../../lib/math/rng";
import { vnew } from "../../../../lib/math/vector-type";
import { container } from "../../../../lib/pixi/container";

interface ObjFxLibBurstArgs {
    count: Integer;
    distance0: number;
    distance1?: number;
    fxObjConstructor: () => DisplayObject;
    speed0: number;
    speed1?: number;
    tint0?: RgbInt;
    tint1?: RgbInt;
}

export function objFxLibRadialBurst({ count, distance0, fxObjConstructor, speed0, ...args }: ObjFxLibBurstArgs) {
    const distance1 = args.distance1 === undefined ? distance0 : args.distance1;
    const tint0 = args.tint0 === undefined ? 0xffffff : args.tint0;
    const tint1 = args.tint1 === undefined ? tint0 : args.tint1;
    const speed1 = args.speed1 === undefined ? speed0 : args.speed1;

    function tint(obj: DisplayObject) {
        if (!("tint" in obj)) {
            return;
        }

        if (tint0 === tint1) {
            obj.tint = tint0;
        }
        else {
            obj.tint = blendColor(tint0, tint1, Rng.float());
        }
    }

    return container()
        .coro(function* (self) {
            for (let i = 0; i < count; i++) {
                const radians = (i * Math.PI * 2) / count;
                const start = vnew(Math.sin(radians), Math.cos(radians)).scale(Rng.float(distance0, distance1));
                const offset = vnew();
                const speed = start.vcpy().normalize().scale(Rng.float(speed0, speed1));
                const fxObj = fxObjConstructor()
                    .step(self => {
                        offset.add(speed);
                        speed.scale(0.97);
                        self.at(start).add(offset).vround();
                    })
                    .at(start)
                    .show(self);
                tint(fxObj);
            }

            yield () => self.children.length === 0;
            self.destroy();
        });
}
