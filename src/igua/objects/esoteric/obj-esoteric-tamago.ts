import { BLEND_MODES, DisplayObject, RenderTexture, Sprite } from "pixi.js";
import { Tx } from "../../../assets/textures";
import { Rng } from "../../../lib/math/rng";
import { container } from "../../../lib/pixi/container";
import { range } from "../../../lib/range";
import { renderer } from "../../current-pixi-renderer";
import { mxnSparkling } from "../../mixins/mxn-sparkling";
import { StepOrder } from "../step-order";
import { EsotericTamaButtons } from "./tamago/esoteric-tama-buttons";
import { EsotericTamaPage } from "./tamago/esoteric-tama-page";

export function objEsotericTamago(buttons: EsotericTamaButtons, homePage: EsotericTamaPage.Home) {
    const renderTx = RenderTexture.create({ width: 60, height: 30 });
    const renderOptions = { renderTexture: renderTx };

    const screenObj = container();

    let page: EsotericTamaPage = homePage;

    return container(
        container(screenObj)
            .invisible(),
        Sprite.from(Tx.Esoteric.Tamago.ShellBackground)
            .at(43, 45),
        container(
            ...range(5).map((i) =>
                Sprite.from(renderTx)
                    .tinted(0)
                    .scaled(2, 2)
                    .step(self => self.alpha = 0.3)
                    .at(i, i)
            ),
            Sprite.from(renderTx)
                .scaled(2, 2)
                .step(self => self.blendMode = BLEND_MODES.ADD),
        )
            .at(48, 50),
        Sprite.from(Tx.Esoteric.Tamago.Shell),
        Sprite.from(Tx.Esoteric.Tamago.Logo)
            .mixin(mxnSparkling)
            .step(self => self.sparklesPerFrame = Rng.float(0.1))
            .at(14, -7),
    )
        .step(() => {
            const nextPage = page.step(buttons);
            if (nextPage) {
                screenObj.removeAllChildren();
                page = nextPage;
            }
            buttons.clear();
            if (!screenObj.children.length) {
                page.getDisplayObject().show(screenObj);
            }
            renderer.render(screenObj, renderOptions);
        }, StepOrder.BeforeCamera)
        .on("destroyed", () => renderTx.destroy());
}
