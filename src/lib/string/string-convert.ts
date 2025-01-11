import { RgbInt } from "../math/number-alias-types";
import { ForceAliasType } from "../types/force-alias-type";

const matchPoundSign = /#/g;

type RgbHexString = ForceAliasType<string>;

function toRgbInt(hex: RgbHexString): RgbInt {
    return Number.parseInt("0x" + hex.replace(matchPoundSign, ""));
}

export const StringConvert = {
    toRgbInt,
};
