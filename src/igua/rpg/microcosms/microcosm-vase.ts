import { Integer } from "../../../lib/math/number-alias-types";
import { AdjustColor } from "../../../lib/pixi/adjust-color";
import { StringFromNumber } from "../../../lib/string/string-from-number";
import { Rpg } from "../rpg";
import { RpgMicrocosm } from "../rpg-microcosm";

export class MicrocosmVase extends RpgMicrocosm<MicrocosmVase.State> {
    constructor(private readonly _config: MicrocosmVase.Config) {
        super();
    }

    get fillUnit() {
        return Math.max(0, Math.min(1, this._state.wetnessUnits / this._config.maxWetnessUnits));
    }

    get isFilled() {
        return this.fillUnit >= 1;
    }

    checkPlayer(): MicrocosmVase.PlayerCheck {
        const wetness = Rpg.character.status.conditions.wetness;
        if (wetness.value <= 0) {
            return { isSuccess: false, reason: "no_wetness" };
        }

        const wetnessUnits = wetness.value;

        const detectedPurity = Math.round(AdjustColor.pixi(wetness.tint).toRgb().b);

        if (this._config.requirePurity && detectedPurity < this._config.requirePurity) {
            return {
                isSuccess: false,
                reason: "impure",
                detectedPurity,
                requiredPurity: this._config.requirePurity,
                wetnessUnits,
            };
        }

        return {
            isSuccess: true,
            wetnessUnits,
            detectedPurity: detectedPurity,
        };
    }

    fill(check: MicrocosmVase.PlayerCheck) {
        if (!check.isSuccess) {
            return;
        }
        this._state.wetnessUnits = Math.min(
            this._state.wetnessUnits + check.wetnessUnits,
            this._config.maxWetnessUnits,
        );
        Rpg.character.status.conditions.wetness.value = 0;
    }

    get viewWetnessPercentage() {
        return StringFromNumber.getPercentageNoDecimal(this._state.wetnessUnits, this._config.maxWetnessUnits);
    }

    createState(): MicrocosmVase.State {
        return {
            wetnessUnits: 0,
        };
    }
}

namespace MicrocosmVase {
    export interface State {
        wetnessUnits: Integer;
    }

    export interface Config {
        requirePurity?: Integer;
        maxWetnessUnits: Integer;
    }

    export namespace PlayerCheck {
        export namespace Error {
            export interface NoWetness {
                reason: "no_wetness";
            }

            export interface Impure {
                reason: "impure";
                detectedPurity: Integer;
                requiredPurity: Integer;
                wetnessUnits: Integer;
            }
        }

        export type Error = { isSuccess: false } & (Error.NoWetness | Error.Impure);
    }

    export type PlayerCheck = PlayerCheck.Error | { isSuccess: true; wetnessUnits: Integer; detectedPurity: Integer };
}
