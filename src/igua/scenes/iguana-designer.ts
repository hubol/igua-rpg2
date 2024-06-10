import { scene } from "../globals";
import { objUiIguanaDesignerRoot } from "../ui/iguana-designer/obj-ui-iguana-designer-root";
import { UiColor } from "../ui/ui-color";

export function IguanaDesigner() {
    scene.style.backgroundTint = UiColor.Shadow;
    objUiIguanaDesignerRoot().show();
}
