import { compileResetter } from "../../src/lib/object/compile-resetter";
import { Assert } from "../lib/assert";

export function compileResetterWorksAsExpected() {
    const obj = {
        ok: 0,
        ok2: 1,
        bbb: true,
        ccc: false,
        ddd: "ddd",
        eee: "",
        deep: {
            a: "a",
            b: 2,
            c: false,
            deeper: {
                hi: 2,
                ok: 99,
            },
        },
    };

    const resetter = compileResetter(obj);

    obj.ok = 99;
    obj.ok2 = 100;
    obj.bbb = false;
    obj.ccc = true;
    obj.ddd = "wowowwowowowow";
    obj.eee = "zzzzzzzzzzzzzz";
    obj.deep.a = "qqqqqqqqqqq";
    obj.deep.b = 9999;
    obj.deep.deeper.ok = 99999999;
    const resetObj = resetter(obj);

    Assert(resetObj).toStrictlyBe(obj);
    Assert(resetObj).toSerializeTo({
        ok: 0,
        ok2: 1,
        bbb: true,
        ccc: false,
        ddd: "ddd",
        eee: "",
        deep: {
            a: "a",
            b: 2,
            c: false,
            deeper: {
                hi: 2,
                ok: 99,
            },
        },
    });
}
