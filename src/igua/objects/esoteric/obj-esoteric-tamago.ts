import { RenderTexture, Sprite } from "pixi.js";
import { Tx } from "../../../assets/textures";
import { Rng } from "../../../lib/math/rng";
import { container } from "../../../lib/pixi/container";
import { range } from "../../../lib/range";
import { renderer } from "../../current-pixi-renderer";
import { mxnSparkling } from "../../mixins/mxn-sparkling";
import { mxnSpeaker } from "../../mixins/mxn-speaker";
import { StepOrder } from "../step-order";
import { EsotericTamaButtons } from "./tamago/esoteric-tama-buttons";
import { EsotericTamaPage } from "./tamago/esoteric-tama-page";

export function objEsotericTamago(buttons: EsotericTamaButtons, homePage: EsotericTamaPage.Home) {
    const renderTx = RenderTexture.create({ width: 120, height: 60 });
    const renderOptions = { renderTexture: renderTx };

    const screenObj = container();

    let page: EsotericTamaPage = homePage;

    return container(
        container(screenObj)
            .invisible(),
        Sprite.from(Tx.Esoteric.Tamago.ShellBackground)
            .at(43, 45),
        container(
            ...range(7).map((i) =>
                Sprite.from(renderTx)
                    .tinted(0)
                    .step(self => self.alpha = 0.1)
                    .at(Math.floor(i / 2), Math.ceil(i / 2))
            ),
            Sprite.from(renderTx),
        )
            .at(48, 50),
        Sprite.from(Tx.Esoteric.Tamago.Shell),
        Sprite.from(Tx.Esoteric.Tamago.Logo)
            .mixin(mxnSparkling)
            .step(self => self.sparklesPerFrame = Rng.float(0.1))
            .at(14, -7),
    )
        .mixin(mxnSpeaker, { name: "Creature Pet", tintPrimary: 0x000000, tintSecondary: 0xffffff })
        .step(() => {
            const nextPage = page.step(buttons);
            if (nextPage) {
                screenObj.removeAllChildren();
                page = nextPage;
            }
            buttons.clear();
            if (!screenObj.children.length) {
                page.getDisplayObject().show(screenObj);
                return;
            }
            renderer.render(screenObj, renderOptions);
        }, StepOrder.BeforeCamera)
        .on("destroyed", () => renderTx.destroy());
}
