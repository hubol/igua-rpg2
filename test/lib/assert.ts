import { paint } from "./paint";

export function Assert(value: unknown) {
    return new AssertBuilder(value);
}

function stringify(value: unknown) {
    if (value === undefined) {
        return "<Undefined>";
    }

    if (value === null) {
        return "<Null>";
    }

    if (typeof value === "function") {
        return `Function ${value}()`;
    }

    let json = "";
    try {
        json = JSON.stringify(value, undefined, 2);
    }
    catch {
    }

    const prefix = typeof value === "object" && value.constructor !== Object ? value.constructor.name : "";

    return [prefix, json].join(" ").trim();
}

class AssertBuilder {
    constructor(private readonly value: unknown) {
    }

    toStrictlyBe(expected: unknown) {
        if (this.value === expected) {
            return;
        }

        const valueJson = stringify(this.value);
        const expectedJson = stringify(expected);

        throw new AssertError(`
Expected
${paint.red(valueJson)}
to be strictly equal to:
${paint.gray(expectedJson)}`);
    }

    toSerializeTo(expected: unknown) {
        const valueJson = stringify(this.value);
        const expectedJson = stringify(expected);

        if (valueJson === expectedJson) {
            return;
        }

        throw new AssertError(`
Expected
${paint.red(valueJson)}
to serialize to:
${paint.gray(expectedJson)}`);
    }

    toBeTruthy() {
        if (!this.value) {
            throw new AssertError(`Expected ${paint.red(stringify(this.value))} to be truthy`);
        }
    }
}

class AssertError extends Error {
    constructor(message: string) {
        super(message);
    }
}
