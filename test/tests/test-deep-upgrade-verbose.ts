import { deepUpgradeVerbose } from "../../src/lib/object/deep-upgrade-verbose";
import { Assert } from "../lib/assert";

export function deepUpgradeVerboseWorksAsExpected() {
    const previous = {
        wrongType: "hi",
        missingKeys: {},
        set: new Set(["cool"]),
        keep: 1000,
        gone: true,
    };

    const next = {
        wrongType: 0,
        missingKeys: {
            array: ["wow!!!"],
            number: 300,
        },
        set: new Set(),
        keep: 10,
    };

    const result = deepUpgradeVerbose(previous, next);
    Assert(result.messages).toSerializeTo(
        [
            "gone: Present in previous value, but not in next value. Dropping.",
            "wrongType: Previous type string does not match next type number, using next value 0",
            "missingKeys.array: Previous not set, using next value [\"wow!!!\"]",
            "missingKeys.number: Previous not set, using next value 300",
        ],
    );
    Assert(result.upgradedObject).toSerializeTo({
        wrongType: 0,
        missingKeys: {
            array: ["wow!!!"],
            number: 300,
        },
        set: new Set(),
        keep: 1000,
    });
    Assert(result.upgradedObject.missingKeys.array).toStrictlyBe(next.missingKeys.array);
    Assert(result.upgradedObject.set).toStrictlyBe(previous.set);
    Assert(result.upgradedObject.set.size).toStrictlyBe(1);
}
