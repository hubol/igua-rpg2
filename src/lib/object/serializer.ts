const SetPrefix = "@__Set__@";

function replacer(this: any, key: string, value: any) {
    if (value instanceof Set) {
        return SetPrefix + JSON.stringify(Array.from(value));
    }

    return value;
}

function reviver(this: any, key: string, value: any) {
    if (typeof value === "string") {
        if (value.startsWith(SetPrefix)) {
            return new Set(JSON.parse(value.substring(SetPrefix.length)));
        }
    }

    return value;
}

function serialize(value: any) {
    return JSON.stringify(value, replacer);
}

function deserialize<T>(text: string): T {
    return JSON.parse(text, reviver);
}

export const Serializer = {
    serialize,
    deserialize,
};
