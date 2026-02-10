import { DisplayObject, Matrix, RenderTexture, Sprite, TilingSprite } from "pixi.js";
import { NoAtlasTx } from "../../../assets/no-atlas-textures";
import { SpriteAlphaMaskFilter } from "../../../lib/pixi/filters/sprite-alpha-mask-filter";
import { renderer } from "../../current-pixi-renderer";
import { scene } from "../../globals";
import { StepOrder } from "../../objects/step-order";

const hw = Math.round(renderer.width / 2);
const hh = Math.round(renderer.height / 2);

export function mxnFxNoise(obj: DisplayObject) {
    const matrix = new Matrix();
    const renderTx = RenderTexture.create({ width: renderer.width, height: renderer.height });
    const renderOptions = { renderTexture: renderTx, transform: matrix };

    return obj
        .coro(function* () {
            const sprite = Sprite.from(renderTx).tinted(0x000000).show(obj.parent);

            new TilingSprite(NoAtlasTx.Effects.Noise256, renderer.width, renderer.height)
                .on("destroyed", () => renderTx.destroy())
                .step((self) => {
                    if (obj.destroyed) {
                        self.destroy();
                        return;
                    }

                    self.at(scene.camera);
                    matrix.tx = -(obj.x - hw);
                    matrix.ty = -(obj.y - hh);
                    sprite.at(obj).add(-hw, -hh);
                    renderer.render(obj, renderOptions);
                }, StepOrder.Camera)
                .filtered(new SpriteAlphaMaskFilter(sprite))
                .zIndexed(obj.zIndex)
                .show(obj.parent);
        });
}
