import { PseudoRng } from "../../src/lib/math/rng";
import { Assert } from "../lib/assert";

export function pseudoRngReturnsFloatInExpectedRange() {
    const r = new PseudoRng(0).float();
    Assert(r >= 0 && r < 1).toBeTruthy();

    const r2 = new PseudoRng(-1).float();
    Assert(r2 >= 0 && r2 < 1).toBeTruthy();
}
