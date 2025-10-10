import { Integer } from "../math/number-alias-types";

export type OneOrTwo<T> = [item0: T, item: T] | T;

export namespace OneOrTwo {
    export function get<T>(oneOrTwo: OneOrTwo<T>, index: Integer) {
        if (Array.isArray(oneOrTwo)) {
            return oneOrTwo[index] ?? oneOrTwo.last;
        }

        return oneOrTwo;
    }
}
