interface ClassLike<T> {
    new(): T;
}

namespace Parser {
    interface Type<T> {
        class: ClassLike<T>;
        prefix: string;
        toString: (value: T) => string;
        fromString: (text: string) => T;
    }

    export function create<T>(parser: Type<T>) {
        return parser;
    }
}

const parsers = [
    Parser.create({
        class: Date,
        prefix: "@__Date__@",
        fromString: (text) => new Date(JSON.parse(text)),
        toString: (date) => JSON.stringify(date),
    }),
    Parser.create({
        class: Set,
        prefix: "@__Set__@",
        fromString: (text) => new Set(JSON.parse(text)),
        toString: (set) => JSON.stringify(Array.from(set)),
    }),
];

function replacer(this: any, key: string, value: any) {
    if (this[key]) {
        value = this[key];
    }
    for (const parser of parsers) {
        if (value instanceof parser.class) {
            return parser.prefix + parser.toString(value as any);
        }
    }

    return value;
}

function reviver(this: any, key: string, value: any) {
    if (this[key]) {
        value = this[key];
    }
    if (typeof value === "string") {
        for (const parser of parsers) {
            if (!value.startsWith(parser.prefix)) {
                continue;
            }

            const text = value.substring(parser.prefix.length);
            return parser.fromString(text);
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
