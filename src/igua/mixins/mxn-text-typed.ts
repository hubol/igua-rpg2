import { BitmapText } from "pixi.js";

export function mxnTextTyped(textObj: BitmapText, textSupplier: () => string) {
    return textObj.step(self => {
        const text = textSupplier();

        if (self.text === text) {
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
