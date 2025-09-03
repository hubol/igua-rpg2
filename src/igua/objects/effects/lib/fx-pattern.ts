import { Integer } from "../../../../lib/math/number-alias-types";
import { Rng } from "../../../../lib/math/rng";
import { VectorSimple } from "../../../../lib/math/vector-type";

export namespace FxPattern {
    interface GetRadialBurstArgs {
        count: Integer;
        radius: number | [radius0: number, radius1: number];
        rotation?: number;
    }

    interface RadialBurstNode {
        index: Integer;
        normal: VectorSimple;
        position: VectorSimple;
    }

    export function getRadialBurst(args: GetRadialBurstArgs) {
        const radius0 = typeof args.radius === "number" ? args.radius : args.radius[0];
        const radius1 = typeof args.radius === "number" ? args.radius : args.radius[1];
        const rotation = args.rotation === undefined ? Rng.float(Math.PI * 2) : args.rotation;

        const nodes: RadialBurstNode[] = [];

        for (let index = 0; index < args.count; index++) {
            const radians = rotation + (index * Math.PI * 2) / args.count;
            const normal = { x: Math.sin(radians), y: Math.cos(radians) };
            const radius = Rng.float(radius0, radius1);

            nodes.push({ index, normal, position: { x: normal.x * radius, y: normal.y * radius } });
        }

        return nodes;
    }
}
