import { DisplayObject } from "pixi.js";
import { Integer } from "../../../../lib/math/number-alias-types";
import { Rng } from "../../../../lib/math/rng";
import { VectorSimple, vnew } from "../../../../lib/math/vector-type";
import { container } from "../../../../lib/pixi/container";

interface ObjFxLibBurstArgs<T extends DisplayObject> {
    count: Integer;
    distance0: number;
    distance1?: number;
    fxObjConstructor: (normal: VectorSimple, index: Integer) => T;
}

export function objFxLibRadialBurst<T extends DisplayObject>(
    { count, distance0, fxObjConstructor, ...args }: ObjFxLibBurstArgs<T>,
) {
    const distance1 = args.distance1 === undefined ? distance0 : args.distance1;

    return container()
        .coro(function* (self) {
            for (let i = 0; i < count; i++) {
                const radians = (i * Math.PI * 2) / count;
                const normal = vnew(Math.sin(radians), Math.cos(radians));

                const obj = fxObjConstructor(normal, i).at(normal, Rng.float(distance0, distance1)).show(self);
            }

            yield () => self.children.length === 0;
            self.destroy();
        });
}
