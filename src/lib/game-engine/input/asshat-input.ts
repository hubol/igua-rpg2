import { Key, KeyCode, KeyListener } from "../../browser/key";
import { Logging } from "../../logging";

export type KeyboardControls<TAction extends string> = {
    [index in TAction]: KeyCode;
}

export class AsshatInput<TAction extends string> {
    constructor(readonly keyboardControls: KeyboardControls<TAction>) {
        console.log(...Logging.componentArgs(this));
    }

    isDown(action: TAction) {
        return Key.isDown(this.keyboardControls[action]);
    }

    isUp(action: TAction) {
        return Key.isUp(this.keyboardControls[action]);
    }

    justWentDown(action: TAction) {
        return Key.justWentDown(this.keyboardControls[action]);
    }

    justWentUp(action: TAction) {
        return Key.justWentUp(this.keyboardControls[action]);
    }

    start() {
        KeyListener.start();
    }

    tick() {
        KeyListener.advance();
    }
}