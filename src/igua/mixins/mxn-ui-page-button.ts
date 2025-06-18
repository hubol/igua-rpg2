import { Input } from "../globals";
import { MxnUiPageElement } from "./mxn-ui-page-element";

interface MxnUiPageButtonArgs {
    onPress: () => void;
    onJustSelected?: () => void;
}

export function mxnUiPageButton(obj: MxnUiPageElement, args: MxnUiPageButtonArgs) {
    return obj.merge(args).step(self => {
        if (self.selected && Input.justWentDown("Confirm")) {
            self.onPress();
        }
    })
        .coro(function* (self) {
            while (true) {
                yield () => self.selected;
                args.onJustSelected?.();
                yield () => !self.selected;
            }
        });
}
