import { lerp } from "../../../lib/game-engine/promise/lerp";
import { sleep } from "../../../lib/game-engine/promise/sleep";
import { Rng } from "../../../lib/math/rng";
import { vnew } from "../../../lib/math/vector-type";
import { AdjustColor } from "../../../lib/pixi/adjust-color";
import { container } from "../../../lib/pixi/container";
import { SceneLocal } from "../../core/scene/scene-local";
import { getDefaultLooks } from "../../iguana/get-default-looks";
import { IguanaLooks } from "../../iguana/looks";
import { objIguanaPuppet } from "../../iguana/obj-iguana-puppet";
import { TypedInput } from "../../iguana/typed-input";
import { objUiButton } from "../framework/button";
import { objUiPage, objUiPageRouter } from "../framework/page";

export const UiIguanaDesignerContext = new SceneLocal(() => ({ looks: getDefaultLooks() }), 'UiIguanaDesignerContext');

export function objUiIguanaDesignerRoot() {
    const c = container();

    const router = objUiPageRouter().show(c);
    
    function page1() {
        return objUiPage([
            objUiButton('Randomize', randomizeIguanaLooks)
        ],
        { selectionIndex: 0 })
    }

    router.goto(page1());

    objIguanaPreview().at(192, 250).show(c);

    return c;
}

function set(destination: any, path: string[], value: any) {
    if (!path.length)
        return;

    let node = destination;
    for (let i = 0; i < path.length - 1; i++) {
        node = node[path[i]];
    }

    node[path.last] = value;
}

function randomize(schema: TypedInput.Any, value: any, path: string[] = []) {
    switch (schema.kind) {
        case "boolean":
            return set(value, path, Rng.bool());
        case "choice":
            return set(value, path, Rng.int(schema.allowNone ? -1 : 0, schema.options.length));
        case "vector":
            return set(value, path, vnew(Rng.intc(-2, 2), Rng.intc(-2, 2)));
        case "integer":
            return set(value, path, Rng.intc(0, 2));
        case "color":
            return set(value, path, AdjustColor.rgb(Rng.float(255), Rng.float(255), Rng.float(255)).toPixi());
        default:
            for (const key in schema as any) {
                randomize(schema[key], value, [...path, key]);
            }
    }
}

function randomizeIguanaLooks() {
    // Very crude placeholder
    randomize(IguanaLooks.create() as any, UiIguanaDesignerContext.value.looks);
}

function objIguanaPreview() {
    let lastLooksJson: string;
    let iguana: ReturnType<typeof objIguanaPreviewInstance>;

    function objIguanaPreviewInstance() {
        const puppet = objIguanaPuppet(UiIguanaDesignerContext.value.looks)
        .step(() => {
            if (puppet.gait > 0)
                puppet.pedometer += 0.1;
        })
        .async(async () => {
            while (true) {
                await sleep(1000);
                await lerp(puppet, 'ducking').to(1).over(300);
                await sleep(1000);
                await lerp(puppet, 'ducking').to(0).over(300);
                await sleep(1000);
                await lerp(puppet, 'gait').to(1).over(300);
                await sleep(1000);
                await lerp(puppet, 'gait').to(0).over(300);
                await sleep(1000);
                await lerp(puppet, 'facing').to(-puppet.facing).over(300);
            }
        });
        return puppet;
    }

    function getLooksJson() {
        return JSON.stringify(UiIguanaDesignerContext.value.looks);
    }

    const c = container()
    .step(() => {
        const looksJson = getLooksJson();

        if (looksJson === lastLooksJson)
            return;

        iguana?.destroy();
        iguana = objIguanaPreviewInstance().show(c);
        lastLooksJson = looksJson;
    });

    return c;
}