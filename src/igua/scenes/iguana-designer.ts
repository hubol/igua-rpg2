import { scene } from "../globals";
import { objUiIguanaDesignerRoot } from "../ui/iguana-designer/root";

export function IguanaDesigner() {
    scene.backgroundTint = 0x585080;
    objUiIguanaDesignerRoot().show();
}