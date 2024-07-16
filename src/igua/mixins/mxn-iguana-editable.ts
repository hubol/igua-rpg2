import { Environment } from "../../lib/environment";
import { wait } from "../../lib/game-engine/promise/wait";
import { Cutscene, DevKey, layers } from "../globals";
import { IguanaLooks } from "../iguana/looks";
import { ObjIguanaLocomotive, objIguanaLocomotive } from "../objects/obj-iguana-locomotive";
import { playerObj } from "../objects/obj-player";
import { UiIguanaDesignerContext, objUiIguanaDesignerRoot } from "../ui/iguana-designer/obj-ui-iguana-designer-root";

export function mxnIguanaEditable(obj: ObjIguanaLocomotive, looks: IguanaLooks.Serializable) {
    if (!Environment.isDev)
        return obj;
    return obj.step(self => {
        if (playerObj.collides(self) && playerObj.hasControl && DevKey.isDown('ControlLeft') && DevKey.justWentDown('Slash'))
            Cutscene.play(async () => {
                UiIguanaDesignerContext.destroy();
                
                const designer = objUiIguanaDesignerRoot(looks);
                designer.show(layers.hud);
                await wait(() => DevKey.justWentDown('Escape'));
                designer.destroy();

                const nextLooks = UiIguanaDesignerContext.value.looks;
                const iguana = objIguanaLocomotive(nextLooks)
                    .mixin(mxnIguanaEditable, nextLooks)
                    .at(self);

                self.parent.addChildAt(iguana, self.parent.getChildIndex(self));
                self.destroy();
        });
    });
}