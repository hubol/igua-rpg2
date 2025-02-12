import { Diff } from "../../src/lib/object/diff";
import { Assert } from "../lib/assert";

export function testDiffWorksAsExpected() {
    const previous = {
        arrayNoChange: [0, 1, 2],
        object: {
            object: {
                arrayChange: [3],
                change: 0,
                noChange: 0,
            },
            noChange: "asdf",
        },
    };

    const next = {
        arrayNoChange: [0, 1, 2],
        object: {
            object: {
                arrayChange: ["q"],
                change: 1,
                noChange: 0,
            },
            noChange: "asdf",
        },
    };

    const diff = Diff.detectUpdatedValues(previous, next);

    Assert(diff).toSerializeTo([
        { path: ["object", "object", "arrayChange"], value: ["q"] },
        { path: ["object", "object", "change"], value: 1 },
    ]);

    Diff.apply(previous, diff);

    Assert(previous).toSerializeTo(next);
}
