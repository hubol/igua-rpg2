import { DisplayObject } from "pixi.js";
import { Integer } from "../../lib/math/number-alias-types";
import { Action } from "../core/input";
import { Input } from "../globals";

interface RepeatingActionState {
    keyDownFor: Integer;
    repeats: Integer;
    justWentDown: boolean;
}

export function mxnActionRepeater<TAction extends Action>(
    obj: DisplayObject,
    actions: TAction[],
) {
    const states: Record<TAction, RepeatingActionState> = Object.assign(
        {},
        ...actions.map((action): Record<string, RepeatingActionState> => ({
            [action]: { justWentDown: false, keyDownFor: 0, repeats: 0 },
        })),
    );

    function reset(action: TAction) {
        states[action].justWentDown = false;
        states[action].keyDownFor = 0;
        states[action].repeats = 0;
    }

    obj.step(() => {
        let downCount = 0;

        for (const action of actions) {
            if (Input.isDown(action)) {
                downCount++;

                const state = states[action];
                state.keyDownFor++;
                state.justWentDown = state.keyDownFor === 1
                    || (state.keyDownFor % 2 === 0 && state.keyDownFor > 15);
                if (state.justWentDown) {
                    state.repeats++;
                }
            }
            else {
                reset(action);
            }
        }

        if (actions.length > 1 && downCount === actions.length) {
            for (const action of actions) {
                reset(action);
            }
        }
    });

    const mxnActionRepeater = {
        justWentDown(action: TAction) {
            return states[action].justWentDown;
        },
        repeats(action: TAction) {
            return states[action].repeats;
        },
    };

    return obj.merge({ mxnActionRepeater });
}
