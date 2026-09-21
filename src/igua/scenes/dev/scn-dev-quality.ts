import { Graphics } from "pixi.js";
import { objText } from "../../../assets/fonts";
import { Lvl } from "../../../assets/generated/levels/generated-level-data";
import { Integer, RgbInt } from "../../../lib/math/number-alias-types";
import { Vector, VectorSimple, vnew } from "../../../lib/math/vector-type";
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
    let lastTime = -1;

    for (const [dateString, sliceData] of Object.entries(statisticsJson)) {
        const time = new Date(dateString).getTime();
        if (firstTime === null) {
            firstTime = time;
        }
        lastTime = time;
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

    // Interesting, the transform is outdated without this
    // Reason #99999 to build my own renderer
    obj.updateTransform();

    function getTimeWorldX(time: number): VectorSimple {
        const point = vnew(16 * (time - firstTime!) / oneMonthMilliseconds, 0);
        const result = obj.worldTransform.apply(point);
        return result;
    }

    {
        let time = firstTime!;
        while (time < lastTime) {
            const rawDate = new Date(time);
            const monthIndex = (rawDate.getMonth() + 1) % 12;
            const year = rawDate.getFullYear() + (monthIndex === 0 ? 1 : 0);
            const date = new Date(year, monthIndex);
            time = date.getTime();

            objText.Medium("- " + monthStrings[monthIndex] + " " + year)
                .at(getTimeWorldX(time).x, 210)
                .anchored(0, 0.5)
                .angled(90)
                .zIndexed(ZIndex.BackgroundEntities)
                .show();
        }
    }
}

const monthStrings = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
];

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
