import { Assert } from "../../../lib/assert";
import { Serializer } from "../../../lib/object/serializer";
import { container } from "../../../lib/pixi/container";
import { mxnDevTest } from "../../mixins/mxn-dev-test";

export function scnDevTestSerializer() {
    container()
        .at(0, 128)
        .mixin(mxnDevTest, function* () {
            const date = new Date("2026");
            const parsed = Serializer.deserialize<{ date: Date; set: Set<string> }>(
                Serializer.serialize({ date, set: new Set(["hi"]) }),
            );
            Assert(parsed.date instanceof Date).toBeTruthy();
            Assert(parsed.set.size).toStrictlyBe(1);
            Assert([...parsed.set.values()][0]).toStrictlyBe("hi");
        })
        .show();
}
