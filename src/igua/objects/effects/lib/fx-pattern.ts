import { Integer } from "../../../../lib/math/number-alias-types";
import { Rng } from "../../../../lib/math/rng";
import { VectorSimple } from "../../../../lib/math/vector-type";

export namespace FxPattern {
    interface GetRadialBurstArgs {
        count: Integer;
        radius0: number;
        radius1?: number;
        rotation?: number;
    }

    interface RadialBurstNode {
        index: Integer;
        normal: VectorSimple;
        position: VectorSimple;
    }

    export function getRadialBurst(args: GetRadialBurstArgs) {
        const radius1 = args.radius1 === undefined ? args.radius0 : args.radius1;
        const rotation = args.rotation === undefined ? Rng.float(Math.PI * 2) : args.rotation;

        const nodes: RadialBurstNode[] = [];

        for (let index = 0; index < args.count; index++) {
            const radians = rotation + (index * Math.PI * 2) / args.count;
            const normal = { x: Math.sin(radians), y: Math.cos(radians) };
            const radius = Rng.float(args.radius0, radius1);

            nodes.push({ index, normal, position: { x: normal.x * radius, y: normal.y * radius } });
        }

        return nodes;
    }
}
