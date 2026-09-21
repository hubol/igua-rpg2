import { Graphics } from "pixi.js";
import { Lvl } from "../../../assets/generated/levels/generated-level-data";
import { Integer, RgbInt } from "../../../lib/math/number-alias-types";
import { PseudoRng } from "../../../lib/math/rng";
import { Vector, vnew } from "../../../lib/math/vector-type";
import { AdjustColor } from "../../../lib/pixi/adjust-color";
import { container } from "../../../lib/pixi/container";
import { Null } from "../../../lib/types/null";
import { ZIndex } from "../../core/scene/z-index";
import statisticsJson from "../../dev/data/statistics.json";
import { mxnHudModifiers } from "../../mixins/mxn-hud-modifiers";

const oneMonthMilliseconds = 1000 * 60 * 60 * 24 * 30;

export function scnDevQuality() {
    Lvl.DevStatistics();
    const metadata = getEntityMetadata();
    const obj = container();
    const lineGraphObjs: Record<string, objLineGraph.Type> = {};

    let firstTime = Null<Integer>();

    for (const [dateString, sliceData] of Object.entries(statisticsJson)) {
        const time = new Date(dateString).getTime();
        if (firstTime === null) {
            firstTime = time;
        }
        const x = 16 * (time - firstTime) / oneMonthMilliseconds;
        for (const [entityId, entityCount] of Object.entries(sliceData)) {
            lineGraphObjs[entityId] ??= objLineGraph(metadata[entityId].tint).show(obj);
            const y = -entityCount;
            lineGraphObjs[entityId].objLineGraph.addPoint(x, y);
        }
    }

    obj
        .mixin(mxnHudModifiers.mxnHideStatus)
        .mixin(mxnHudModifiers.mxnHideExperience)
        .scaled(2, 2)
        .zIndexed(ZIndex.BackgroundEntities)
        .at(16, 200)
        .show();

    console.log(metadata);
}

function objLineGraph(tint: RgbInt) {
    let previousPosition = Null<Vector>();

    const linesGfx = new Graphics().lineStyle(0.5, tint);
    const pointsGfx = new Graphics().beginFill(tint);

    const api = {
        addPoint(x: number, y: number) {
            if (previousPosition) {
                linesGfx.lineTo(x, y);
            }
            else {
                linesGfx.moveTo(x, y);
                previousPosition = vnew();
            }

            pointsGfx.drawCircle(x, y, 1.5);

            previousPosition.at(x, y);
        },
    };

    return container(linesGfx, pointsGfx)
        .merge({ objLineGraph: api });
}

namespace objLineGraph {
    export type Type = ReturnType<typeof objLineGraph>;
}

function getEntityMetadata() {
    const entityIds = [
        ...new Set(
            Object.values(statisticsJson)
                .flatMap(value => Object.keys(value)),
        ),
    ]
        .sort();

    return entityIds.reduce((obj, id, index) => {
        const tint = AdjustColor.hsv((index / entityIds.length) * 360, 75, 75).toPixi();
        obj[id] = { tint };
        return obj;
    }, {} as Record<string, { tint: RgbInt }>);
}

const factors = [
    999,
    444,
    555,
];

function toInteger(string: string) {
    let result = 0;
    for (let i = 0; i < string.length; i++) {
        result += string.charCodeAt(i) * (factors[i % factors.length]);
    }

    return result;
}
