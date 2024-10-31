import { Lvl } from "../../assets/generated/levels/generated-level-data";
import { objUiIguanaDesignerRoot } from "../ui/iguana-designer/obj-ui-iguana-designer-root";

export function scnIguanaDesigner() {
    const { LightShadowIrregularSmall } = Lvl.MenuIguanaDesigner();
    objUiIguanaDesignerRoot({ leftFacingPreviewPosition: LightShadowIrregularSmall }).show();
}
