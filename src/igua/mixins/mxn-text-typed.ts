import { Logger } from "../../lib/game-engine/logger";
import { AsshatText } from "../../lib/pixi/asshat-text";

export function mxnTextTyped(textObj: AsshatText, textSupplier: () => string) {
    return textObj.step(self => {
        const text = textSupplier();

        if (self.text === text) {
            return;
        }

        if (typeof text !== "string" || typeof self.text !== "string") {
            Logger.logContractViolationError("mxnTextTyped", new Error("Text must be a string, not a Txt instance"));
            return;
        }

        if (self.text === text.substring(0, self.text.length)) {
            self.text = text.substring(0, self.text.length + 1);
        }
        else {
            self.text = self.text.substring(0, self.text.length - 1);
        }
    });
}
