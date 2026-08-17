import { Container, Texture } from "pixi.js";

export function txt(strings: TemplateStringsArray, ...values: txt.TemplateValue[]): string & txt.Type {
    const data = new Array<txt.Data>();

    const sanitizedStrings: string[] = strings.map(txt.sanitizeNewLine);

    for (let i = 0; i < sanitizedStrings.length; i++) {
        data.push(...sanitizedStrings[i]);
        const value = values[i];
        if (values[i]) {
            if (typeof value === "number") {
                data.push(String(value));
            }
            else if (typeof value === "string") {
                data.push(txt.sanitizeNewLine(value));
            }
            else {
                data.push(value);
            }
        }
    }

    return new Txt(data) as any;
}

class Txt implements txt.Type {
    constructor(
        private readonly _data: Array<txt.Data>,
    ) {
    }

    get length() {
        return this._data.length;
    }

    charAt(index: number): txt.Data {
        return this._data[index] ?? "";
    }

    substring(start: number, end: number): txt.Type {
        return new Txt(this._data.slice(start, end));
    }

    toString() {
        return "<Txt instance>";
    }
}

txt.sanitizeNewLine = function sanitizeNewLine (text: string) {
    return text.replace(/(?:\r\n|\r)/g, "\n");
};

export namespace txt {
    export interface Type {
        charAt(index: number): Data;
        readonly length: number;
        substring(start: number, end: number): Type;
    }

    export type Data = string | Data.Pixi;

    export namespace Data {
        export type Pixi = Container | Texture;
    }

    export type TemplateValue = number | Data;
}
