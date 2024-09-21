import { UiIguanaDesignerContext } from "../obj-ui-iguana-designer-root";
import { objUiDesignerButton } from "./obj-ui-designer-button";

export function objUiIguanaDesignerBackButton(title: "OK" | "Back") {
    return objUiDesignerButton(title, () => UiIguanaDesignerContext.value.router.pop());
}
