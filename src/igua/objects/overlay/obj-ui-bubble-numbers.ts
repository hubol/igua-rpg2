import { Graphics } from "pixi.js";
import { objText } from "../../../assets/fonts";
import { factor, interpr } from "../../../lib/game-engine/routines/interp";
import { sleep } from "../../../lib/game-engine/routines/sleep";
import { approachLinear } from "../../../lib/math/number";
import { Integer } from "../../../lib/math/number-alias-types";
import { Rng } from "../../../lib/math/rng";
import { container } from "../../../lib/pixi/container";
import { scene } from "../../globals";

const Consts = {
    gap: 3,
    radius: 5,
};

interface ObjUiBubbleNumberArgs {
    value: Integer;
}

export function objUiBubbleNumber({ value }: ObjUiBubbleNumberArgs) {
    const controls = {
        value,
    };

    const state = {
        renderedValue: null as unknown as Integer,
    };

    const digitObjs: ObjUiBubbleDigit[] = [];

    function getTargetPivotX() {
        return Math.round(obj.width / 2);
    }

    const obj = container()
        .merge({ controls, state })
        .coro(function* () {
            while (true) {
                yield () => controls.value !== state.renderedValue;
                const digits = [...String(Math.abs(controls.value))].map(Number);
                for (let i = 0; i < Math.max(digits.length, digitObjs.length); i++) {
                    const digit = digits[i];
                    const digitObj = digitObjs[i];

                    if (digit === undefined && digitObj) {
                        yield* digitObj.controls.die();
                        delete digitObjs[i];
                    }
                    if (digit !== undefined) {
                        if (!digitObj) {
                            digitObjs[i] = objUiBubbleDigit(digit)
                                .at(Consts.radius + (Consts.radius * 2 + Consts.gap) * i, 0)
                                .show(obj);
                        }
                        else {
                            digitObj.controls.digit = digit;
                        }
                    }
                }
                digitObjs.length = digits.length;
                state.renderedValue = controls.value;
            }
        })
        .coro(function* () {
            obj.pivot.x = getTargetPivotX();
            let appliedLength = digitObjs.length;
            while (true) {
                yield () => appliedLength !== digitObjs.length && obj.children.length === digitObjs.length;
                appliedLength = digitObjs.length;
                yield interpr(obj.pivot, "x").factor(factor.sine).to(getTargetPivotX()).over(500);
            }
        });

    return obj;
}

function objUiBubbleDigit(digit: Integer) {
    const bubbleGfx = new Graphics().beginFill(0xffffff).drawRoundedRect(
        -Consts.radius,
        -Consts.radius,
        Consts.radius * 2,
        Consts.radius * 2 - 1,
        4,
    );
    const textObj = objText.SmallDigits("" + digit, { tint: 0x000000 }).anchored(0.5, 0.5).at(1, 0);

    let renderedDigit = digit;

    const controls = {
        get digit() {
            return digit;
        },
        set digit(value) {
            digit = value;
        },
        *die() {
            textObj.visible = false;
            bubbleGfx.scaled(0.5, 0.5);
            yield sleep(250);
            obj.destroy();
        },
    };

    const seed = Rng.int(255555);

    const obj = container(bubbleGfx, textObj)
        .step(() => {
            obj.pivot.y = Math.round(Math.sin((scene.ticker.ticks) * 0.05 * Math.PI + seed));
            if (renderedDigit === digit || scene.ticker.ticks % 3 !== 0) {
                return;
            }
            renderedDigit = approachLinear(renderedDigit, digit, 1);
            textObj.text = "" + renderedDigit;
        });

    return obj.merge({ controls });
}

type ObjUiBubbleDigit = ReturnType<typeof objUiBubbleDigit>;
