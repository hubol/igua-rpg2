import { DisplayObject, Graphics, IBaseTextureOptions, IRendererRenderOptions, RenderTexture, Sprite } from "pixi.js";
import { sleep } from "../../../lib/game-engine/routines/sleep";
import { PseudoRng, Rng } from "../../../lib/math/rng";
import { vnew } from "../../../lib/math/vector-type";
import { container } from "../../../lib/pixi/container";
import { range } from "../../../lib/range";
import { renderer } from "../../current-pixi-renderer";
import { scene } from "../../globals";
import { StepOrder } from "../step-order";

const prng = new PseudoRng();
const v = vnew();

export function objFxLight() {
    const renderTx0 = RenderTexture.create({ width: renderer.width, height: renderer.height });
    const renderTx1 = RenderTexture.create({ width: renderer.width, height: renderer.height });

    const shadowCastObj = container(
        ...range(100).map(() => {
            const obj = Sprite.from(renderTx0).tinted(0x000000);
            obj.alpha = 0.8;
            return obj;
        }),
    );
    const renderObj1 = container(
        new Graphics()
            .beginFill(0xffffff, 0.8)
            .drawRect(0, 0, renderer.width, renderer.height),
        shadowCastObj,
    );

    const clear0: IRendererRenderOptions = { renderTexture: renderTx0, clear: true };
    const render0: IRendererRenderOptions = { renderTexture: renderTx0, clear: false };
    const render1: IRendererRenderOptions = { renderTexture: renderTx1, clear: false };

    const api = {
        shadowCasterObjs: new Array<DisplayObject>(),
        direction: vnew(0, 1),
    };

    let unit = 0;
    let seed = 0;

    return Sprite.from(renderTx1)
        .merge({ objFxLight: api })
        .step(() => {
            if ((unit += 0.5 + Rng.float(0.1)) < 1) {
                return;
            }

            unit -= 1;

            for (const obj of api.shadowCasterObjs) {
                if (obj.destroyed) {
                    api.shadowCasterObjs = api.shadowCasterObjs.filter(obj => !obj.destroyed);
                    break;
                }
            }

            for (let i = 0; i < api.shadowCasterObjs.length; i++) {
                renderer.render(api.shadowCasterObjs[i], i === 0 ? clear0 : render0);
            }

            prng.seed = seed;
            v.at(0, 0);

            for (let i = 0; i < shadowCastObj.children.length; i++) {
                shadowCastObj.children[i].position
                    .at(api.direction, i * 2.8 + 1)
                    .add(v)
                    .vround();

                v.add(prng.float(-0.5, 0.5), prng.float(-0.5, 0.5));
            }

            renderer.render(renderObj1, render1);
        }, StepOrder.Camera)
        .coro(function* () {
            while (true) {
                seed = Rng.int(9999999999);
                yield sleep(Rng.int(200, 500));
            }
        })
        .on("destroyed", () => {
            renderTx0.destroy();
            renderTx1.destroy();
        })
        .show(scene.staticStage);
}
