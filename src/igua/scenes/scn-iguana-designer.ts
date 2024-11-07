import { Lvl } from "../../assets/generated/levels/generated-level-data";
import { mxnBoilPivot } from "../mixins/mxn-boil-pivot";
import { objUiIguanaDesignerRoot } from "../ui/iguana-designer/obj-ui-iguana-designer-root";

export function scnIguanaDesigner() {
    const { LightShadowIrregularSmall, Group1 } = Lvl.MenuIguanaDesigner();
    Group1.children.forEach(x => x.mixin(mxnBoilPivot));
    objUiIguanaDesignerRoot({ leftFacingPreviewPosition: LightShadowIrregularSmall }).show();
}
