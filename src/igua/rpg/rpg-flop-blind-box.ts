import { Integer } from "../../lib/math/number-alias-types";
import { Rng } from "../../lib/math/rng";
import { DataKeyItem } from "../data/data-key-item";

const flopIdRanges = {
    FlopBlindBox: [99, 198],
    FlopBlindBoxTypeB: [199, 298],
} satisfies Partial<Record<DataKeyItem.Id, [start: Integer, end: Integer]>>;

export namespace RpgFlopBlindBox {
    export type KeyItemId = keyof typeof flopIdRanges;

    export const keyItemIds = Object.keys(flopIdRanges) as ReadonlyArray<KeyItemId>;

    export function open(keyItemId: KeyItemId) {
        return Rng.intc(...flopIdRanges[keyItemId]);
    }
}
