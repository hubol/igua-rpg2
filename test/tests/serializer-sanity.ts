import { Serializer } from "../../src/lib/object/serializer";
import { Assert } from "../lib/assert";

export function serializeDeserializeWorks() {
    const source = {
        set1: new Set(["a", "b", { wtf: 32 }]),
        set2: new Set(),
        whatever: {
            x: -32,
            y: 32,
        },
    };

    const text = Serializer.serialize(source);

    Assert(text).toStrictlyBe(
        "{\"set1\":\"@__Set__@[\\\"a\\\",\\\"b\\\",{\\\"wtf\\\":32}]\",\"set2\":\"@__Set__@[]\",\"whatever\":{\"x\":-32,\"y\":32}}",
    );

    const sourceClone = Serializer.deserialize<typeof source>(text);

    Assert(sourceClone.set1 instanceof Set).toBeTruthy();
    Assert(sourceClone.set1.has("a")).toBeTruthy();
    Assert(sourceClone.set1.has("b")).toBeTruthy();
    Assert(sourceClone.set1.size).toStrictlyBe(3);

    Assert(sourceClone.set2 instanceof Set).toBeTruthy();
    Assert(sourceClone.set2.size).toStrictlyBe(0);

    Assert(sourceClone.whatever.x).toStrictlyBe(-32);
    Assert(sourceClone.whatever.y).toStrictlyBe(32);

    Assert(Object.keys(sourceClone).length).toStrictlyBe(3);
}

export function canSerializeSetDirectly() {
    const source = new Set();

    const text = Serializer.serialize(source);

    const sourceClone = Serializer.deserialize<typeof source>(text);

    Assert(sourceClone instanceof Set).toBeTruthy();
    Assert(sourceClone.size).toStrictlyBe(0);
}
