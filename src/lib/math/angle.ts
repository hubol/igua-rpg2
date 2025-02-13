import { DegreesFloat } from "./number-alias-types";
import { vnew } from "./vector-type";

export function degDifference(a: DegreesFloat, b: DegreesFloat) {
    return Math.min(Math.abs(a + 360 - b), Math.abs(a - b)) % 360;
}

export const ToRad = Math.PI / 180;

export function vdeg(degrees: DegreesFloat) {
    return vnew().at(Math.cos(degrees * ToRad), Math.sin(degrees * ToRad));
}
