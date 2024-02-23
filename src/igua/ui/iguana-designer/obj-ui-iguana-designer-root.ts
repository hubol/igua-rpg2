import { lerp } from "../../../lib/game-engine/promise/lerp";
import { sleep } from "../../../lib/game-engine/promise/sleep";
import { Rng } from "../../../lib/math/rng";
import { vnew } from "../../../lib/math/vector-type";
import { AdjustColor } from "../../../lib/pixi/adjust-color";
import { container } from "../../../lib/pixi/container";
import { SceneLocal } from "../../core/scene/scene-local";
import { ConnectedInput } from "../../iguana/connected-input";
import { getDefaultLooks } from "../../iguana/get-default-looks";
import { IguanaLooks } from "../../iguana/looks";
import { objIguanaPuppet } from "../../iguana/obj-iguana-puppet";
import { TypedInput } from "../../iguana/typed-input";
import { objUiButton } from "../framework/obj-ui-button";
import { objUiPage, objUiPageRouter } from "../framework/obj-ui-page";
import { objUiCheckboxInput } from "./components/obj-ui-checkbox-input";
import { objUiPlacementInput } from "./components/obj-ui-placement-input";
import { objUiSliderInput } from "./components/obj-ui-slider-input";
import { objUiTextureChoiceInput } from "./components/obj-ui-texture-choice-input";

function context() {
    let looks = getDefaultLooks();
    let connectedInput = ConnectedInput.create(IguanaLooks.create(), looks);

    return {
        get looks() {
            return looks;
        },
        set looks(value: IguanaLooks.Serializable) {
            looks = value;
            connectedInput = ConnectedInput.create(IguanaLooks.create(), looks);
        },
        get connectedInput() {
            return connectedInput;
        },
        router: objUiPageRouter(),
        get page() {
            return this.router.page;
        }
    }
}

export const UiIguanaDesignerContext = new SceneLocal(context, 'UiIguanaDesignerContext');

export function objUiIguanaDesignerRoot(looks = getDefaultLooks()) {
    const context = UiIguanaDesignerContext.value;

    context.looks = looks;

    const c = container();
    const router = context.router.at(2, 2).show(c);
    
    function page1() {
        return objUiPage([
            objUiButton('Randomize', randomizeIguanaLooks).jiggle(),
            objUiSliderInput('Eye tilt', context.connectedInput.head.eyes.tilt, context.connectedInput.head.eyes.tilt).at(0, 33),
            objUiCheckboxInput('Mouth flip', context.connectedInput.head.mouth.flipV).at(0, 66),
            objUiPlacementInput('Crest position', context.connectedInput.head.crest.placement, context.connectedInput.head.crest.placement).at(0, 99),
            objUiTextureChoiceInput(context.connectedInput.head.crest.shape, context.connectedInput.head.crest.shape).at(0, 99 + 33),
            objUiTextureChoiceInput(context.connectedInput.head.horn.shape, context.connectedInput.head.horn.shape).at(0, 99 + 66),
        ],
        { selectionIndex: 0 })
    }

    router.replace(page1());

    objIguanaPreview().at(160, 250).show(c);

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

        puppet.scale.set(3);

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