import { Texture } from "pixi.js";
import { Integer } from "../math/number-alias-types";

export function txt(strings: TemplateStringsArray, ...values: txt.TemplateValue[]): string & txt.Type {
    return new Txt(
        strings.map(txt.sanitizeNewLine),
        values.map(value => typeof value === "number" ? String(value) : value),
    ) as any;
}

class Txt implements txt.Type {
    constructor(
        readonly strings: Array<string>,
        readonly values: Array<string | Texture>,
    ) {
    }

    toString() {
        return "<Txt instance>";
    }
}

txt.sanitizeNewLine = function sanitizeNewLine (text: string) {
    return text.replace(/(?:\r\n|\r)/g, "\n");
};

txt.iterate = function iterate (iterable: txt.Iterable, position: Integer): txt.IterateResult {
    if (typeof iterable === "string") {
        return position < iterable.length ? iterable.charAt(position) : null;
    }

    for (let i = 0; i < iterable.strings.length; i++) {
        const string = iterable.strings[i];
        if (position < string.length) {
            return string.charAt(position);
        }

        position -= string.length;
        const value = iterable.values[i];

        if (!value) {
            return null;
        }

        if (typeof value === "string") {
            if (position < value.length) {
                return value.charAt(position);
            }

            position -= value.length;
        }
        else {
            if (position === 0) {
                return value;
            }

            position -= 1;
        }
    }

    return null;
};

export namespace txt {
    export interface Type {
        strings: Array<string>;
        values: Array<string | Texture>;
    }

    export type TemplateValue = string | number | Texture;

    export type Iterable = Type | string;

    export type IterateResult = string | Texture | null;
}
