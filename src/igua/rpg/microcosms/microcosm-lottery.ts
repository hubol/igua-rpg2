import { Integer } from "../../../lib/math/number-alias-types";
import { Rng } from "../../../lib/math/rng";
import { range } from "../../../lib/range";
import { MicrocosmTimeDroppedLoot } from "./microcosm-time-dropped-loot";

export class MicrocosmLottery extends MicrocosmTimeDroppedLoot<MicrocosmLottery.State> {
    constructor(readonly config: MicrocosmLottery.Config) {
        super({ replenishFn: () => 10 });
    }

    get didPlayerPickNumbers() {
        return Boolean(this._state.pickedNumbers);
    }

    pickNumbers(numbers: MicrocosmLottery.Numbers) {
        this._state.drawnNumbers = null;
        this._state.pickedNumbers = {
            lucky: numbers.lucky,
            normal: [...numbers.normal]
                .sort((a, b) => a - b),
        };
        this.reset();
    }

    checkIsActive(): boolean {
        const isActive = super.checkIsActive();
        if (isActive && !this._state.drawnNumbers) {
            this._state.drawnNumbers = MicrocosmLottery._drawNumbers(this.config);
        }

        return isActive;
    }

    private static _drawNumbers(config: MicrocosmLottery.Config): MicrocosmLottery.Numbers {
        return {
            lucky: Rng.intc(1, config.luckyNumberMax),
            normal: Rng.shuffle(range(config.normalNumbersMax).map(i => i + 1))
                .slice(0, config.normalNumbersCount)
                .sort((a, b) => a - b),
        };
    }

    private static _checkWin(
        pickedNumbers: MicrocosmLottery.Numbers,
        drawnNumbers: MicrocosmLottery.Numbers,
    ): MicrocosmLottery.WinCheck {
        return {
            isLuckyNumberCorrect: pickedNumbers.lucky === drawnNumbers.lucky,
            normalNumbersCorrectCount: pickedNumbers.normal.reduce(
                (sum, number) => sum + (drawnNumbers.normal.includes(number) ? 1 : 0),
                0,
            ),
        };
    }

    checkWin() {
        if (!this.checkIsActive()) {
            return { isSuccess: false, reason: "not_ready_to_draw" } as const;
        }
        if (!this._state.pickedNumbers) {
            return { isSuccess: false, reason: "player_did_not_pick_numbers" } as const;
        }
        if (!this._state.drawnNumbers) {
            return { isSuccess: false, reason: "no_numbers_drawn" } as const;
        }

        const check = MicrocosmLottery._checkWin(this._state.pickedNumbers, this._state.drawnNumbers);
        return { isSuccess: true, prize: this.config.prizeFn(check) } as const;
    }

    protected createState(): MicrocosmLottery.State {
        return {
            ...super.createState(),
            pickedNumbers: null,
        };
    }
}

export namespace MicrocosmLottery {
    export interface State extends MicrocosmTimeDroppedLoot.State {
        pickedNumbers: Numbers | null;
        drawnNumbers: Numbers | null;
    }

    export interface Config {
        normalNumbersCount: Integer;
        normalNumbersMax: Integer;
        luckyNumberMax: Integer;
        price: Integer;
        prizeFn: PrizeFn;
    }

    export interface Numbers {
        normal: Integer[];
        lucky: Integer;
    }

    export type WinCheck = { isLuckyNumberCorrect: boolean; normalNumbersCorrectCount: Integer };

    export type PrizeFn = (winCheck: WinCheck) => Integer;
}
