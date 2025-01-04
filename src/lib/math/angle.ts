import { DegreesFloat } from "./number-alias-types";

export function degDifference(a: DegreesFloat, b: DegreesFloat) {
    return Math.min(Math.abs(a + 360 - b), Math.abs(a - b)) % 360;
}
