import { elToast } from "./elements/el-toast";
import { elToastRoot } from "./elements/el-toast-root";

const rootEl = elToastRoot();
document.body.appendChild(rootEl);

function show(title: string, description: string, type: "info" | "warn", durationMs: number) {
    rootEl.appendChild(elToast(title, description, type, durationMs));
}

export const Toast = {
    info(title: string, description: string, durationMs = 5000) {
        show(title, description, "info", durationMs);
    },
    warn(title: string, description: string, durationMs = 5000) {
        show(title, description, "warn", durationMs);
    },
};
