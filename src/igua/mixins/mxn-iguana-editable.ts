import { Environment } from "../../lib/environment";
import { Cutscene, DevKey, layers } from "../globals";
import { IguanaLooks } from "../iguana/looks";
import { ObjIguanaLocomotive, objIguanaLocomotive } from "../objects/obj-iguana-locomotive";
import { playerObj } from "../objects/obj-player";
import { CtxUiIguanaDesigner, objUiIguanaDesignerRoot } from "../ui/iguana-designer/obj-ui-iguana-designer-root";

export function mxnIguanaEditable(obj: ObjIguanaLocomotive, looks: IguanaLooks.Serializable) {
    if (!Environment.isDev) {
        return obj;
    }
    return obj.step(self => {
        if (
            playerObj.collides(self) && playerObj.hasControl && DevKey.isDown("ControlLeft")
            && DevKey.justWentDown("Slash")
        ) {
            Cutscene.play(function* () {
                CtxUiIguanaDesigner.destroy();

                const designer = objUiIguanaDesignerRoot({ leftFacingPreviewPosition: [400, 240] }, looks);
                designer.show(layers.overlay.dev);
                yield () => DevKey.justWentDown("Escape");
                designer.destroy();

                const nextLooks = CtxUiIguanaDesigner.value.looks;
                const iguana = objIguanaLocomotive({ looks: nextLooks })
                    .mixin(mxnIguanaEditable, nextLooks)
                    .at(self);

                self.parent.addChildAt(iguana, self.parent.getChildIndex(self));
                self.destroy();
            });
        }
    });
}
