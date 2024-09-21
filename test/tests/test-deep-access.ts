import { DeepAccess } from "../../src/lib/object/deep-access";
import { Assert } from "../lib/assert";

export function deepAccessWorksAsExpected() {
    const object = {
        asdf: {
            zzz: {
                qqq: 32,
            },
        },
        b: 17,
    };

    Assert(DeepAccess.get(object, "asdf.zzz.qqq")).toStrictlyBe(32);
    Assert(DeepAccess.get(object, "b")).toStrictlyBe(17);

    DeepAccess.set(object, "asdf.zzz.qqq", 100);
    Assert(DeepAccess.get(object, "asdf.zzz.qqq")).toStrictlyBe(100);

    DeepAccess.set(object, "b", 1000);
    Assert(DeepAccess.get(object, "b")).toStrictlyBe(1000);
}
