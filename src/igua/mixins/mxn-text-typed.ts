import { AsshatText } from "../../lib/pixi/asshat-text";

export function mxnTextTyped(textObj: AsshatText, textSupplier: () => string) {
    return textObj.step(self => {
        const text = textSupplier();

        if (self.text === text) {
            return;
        }

        // TODO !!! important, does not support txt

        if (self.text === text.substring(0, self.text.length)) {
            self.text = text.substring(0, self.text.length + 1);
        }
        else {
            self.text = self.text.substring(0, self.text.length - 1);
        }
    });
}
