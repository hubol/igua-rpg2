import { Integer, RgbInt } from "../../../lib/math/number-alias-types";
import { objStatusBar } from "./obj-status-bar";

interface ObjBuildUpBarArgs {
    /** Should be implemented as a getter */
    readonly value: Integer;
    /** May be implemented as a getter */
    readonly max: Integer;
    tints: objBuildUpBar.Tints;
    width: Integer;
    height: Integer;
}

export function objBuildUpBar(args: ObjBuildUpBarArgs) {
    let value = args.value;

    return objStatusBar({
        height: args.height,
        width: args.width,
        value,
        maxValue: args.max,
        tintBack: args.tints.tintBack,
        tintFront: args.tints.tintFront,
        increases: [{ tintBar: args.tints.tintIncrease }],
        decreases: [{ tintBar: args.tints.tintDecrease }],
    })
        .step(self => {
            const nextValue = args.value;
            self.maxValue = args.max;

            if (nextValue > value) {
                self.increase(nextValue, nextValue - value, 0);
            }
            else if (nextValue < value) {
                self.decrease(nextValue, nextValue - value, 0);
            }
            value = nextValue;
            self.visible = value > 0;
        });
}

export namespace objBuildUpBar {
    export interface Tints {
        tintBack: RgbInt;
        tintFront: RgbInt;
        tintIncrease: RgbInt;
        tintDecrease: RgbInt;
    }
}

objBuildUpBar.tints = {
    Default: {
        tintBack: 0x003000,
        tintFront: 0x008000,
        tintIncrease: 0x00ff00,
        tintDecrease: 0x003000,
    },
    Overheat: {
        tintBack: 0xb43900,
        tintFront: 0xffe600,
        tintDecrease: 0xff8800,
        tintIncrease: 0xfcff3b,
    },
} satisfies Record<string, objBuildUpBar.Tints>;
