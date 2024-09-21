import { DebugColors } from "../debug/debug-colors";
import { createDebugKey } from "../debug/debug-key";
import html from "./el-debug-colors.html";
import { elHubol } from "./lib/el-hubol";

export function elDebugColors() {
    const el = elHubol(html);

    createDebugKey("F8", "debugColors_isOpen", x => el.classList[x ? "remove" : "add"]("hidden"));

    const colors = DebugColors.get();
    el.querySelectorAll<HTMLInputElement>("input[type=\"color\"]").forEach((x, i) => {
        x.value = colors[i];
        x.addEventListener("change", () => DebugColors.update(i, x.value));
    });

    return el;
}
