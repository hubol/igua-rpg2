import { KeyCode, KeyListener } from "../../browser/key-listener";
import { InputModalityType, MappedInputModality } from "./asshat-input";

export type KeyboardControls<TAction extends string> = {
    [index in TAction]: KeyCode;
};

export class MappedKeyboard<TAction extends string> implements MappedInputModality<TAction> {
    private readonly _keyListener: LimitedKeyListener;
    isCurrent = false;

    readonly type = InputModalityType.Keyboard;
    get lastEventTimestamp() {
        return this._keyListener.lastEventTimestamp;
    }

    constructor(private readonly _controls: KeyboardControls<TAction>) {
        const keyCodes = Object.values(_controls as Record<string, KeyCode>);
        this._keyListener = new LimitedKeyListener(new Set(keyCodes));
    }

    isDown(action: TAction): boolean {
        return this._keyListener.isDown(this._controls[action]);
    }

    isUp(action: TAction): boolean {
        return this._keyListener.isUp(this._controls[action]);
    }

    justWentDown(action: TAction): boolean {
        return this._keyListener.justWentDown(this._controls[action]);
    }

    justWentUp(action: TAction): boolean {
        return this._keyListener.justWentUp(this._controls[action]);
    }

    start(): void {
        this._keyListener.start();
    }

    tick(): void {
        if (this.isCurrent) {
            this._keyListener.tick();
        }
    }
}

class LimitedKeyListener extends KeyListener {
    lastEventTimestamp = -1;

    constructor(private readonly _keyCodes: Set<KeyCode>) {
        super();
    }

    protected onKeyDown(event: KeyboardEvent): void {
        if (!this._keyCodes.has(event.code as KeyCode)) {
            return;
        }
        this.lastEventTimestamp = performance.now();
        super.onKeyDown(event);
    }

    protected onKeyUp(event: KeyboardEvent): void {
        if (!this._keyCodes.has(event.code as KeyCode)) {
            return;
        }
        super.onKeyUp(event);
    }
}
