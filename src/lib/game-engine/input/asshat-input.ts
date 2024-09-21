import { Logging } from "../../logging";
import { Undefined } from "../../types/undefined";

export enum InputModalityType {
    Keyboard = "Keyboard",
    Gamepad = "Gamepad",
}

export interface MappedInputModality<TAction extends string> {
    isCurrent: boolean;
    readonly type: InputModalityType;
    readonly lastEventTimestamp: number;
    isDown(action: TAction): boolean;
    isUp(action: TAction): boolean;
    justWentDown(action: TAction): boolean;
    justWentUp(action: TAction): boolean;
    start(): void;
    tick(): void;
}

export class AsshatInput<TAction extends string> {
    private _currentModality?: MappedInputModality<TAction>;

    constructor(private readonly _modalities: MappedInputModality<TAction>[]) {
        console.log(...Logging.componentArgs(this));
    }

    isDown(action: TAction) {
        return this._currentModality?.isDown(action) as boolean;
    }

    isUp(action: TAction) {
        return this._currentModality?.isUp(action) as boolean;
    }

    justWentDown(action: TAction) {
        return this._currentModality?.justWentDown(action) as boolean;
    }

    justWentUp(action: TAction) {
        return this._currentModality?.justWentUp(action) as boolean;
    }

    start() {
        for (const modality of this._modalities) {
            modality.start();
        }
    }

    tick() {
        let latestEventTimestamp = -1;
        let modalityWithLatestEventTimestamp = Undefined<MappedInputModality<TAction>>();

        for (let i = 0; i < this._modalities.length; i++) {
            const modality = this._modalities[i];
            modality.tick();
            if (modality.lastEventTimestamp > latestEventTimestamp) {
                latestEventTimestamp = modality.lastEventTimestamp;
                modalityWithLatestEventTimestamp = modality;
            }
        }

        if (modalityWithLatestEventTimestamp !== this._currentModality) {
            if (this._currentModality) {
                this._currentModality.isCurrent = false;
            }

            const fromType = this._currentModality?.type;
            this._currentModality = modalityWithLatestEventTimestamp;
            const toType = this._currentModality?.type;

            if (fromType && toType) {
                this.onModalityChanged(fromType, toType);
            }

            if (this._currentModality) {
                this._currentModality.isCurrent = true;
            }
        }
    }

    protected onModalityChanged(from: InputModalityType, to: InputModalityType) {
    }
}
