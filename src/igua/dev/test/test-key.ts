import { KeyCode } from "../../../lib/browser/key-listener";

function simulate(code: KeyCode, type: "keydown" | "keyup") {
    const event = new KeyboardEvent(type, { code });
    document.dispatchEvent(event);
}

export const TestKey = {
    tap(code: KeyCode) {
        // Note: Must happen ASYNC or justWentDown will fail!
        setTimeout(() => simulate(code, "keydown"));
        setTimeout(() => simulate(code, "keyup"), 100);
    },
};
