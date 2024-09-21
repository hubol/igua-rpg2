import { Undefined } from "../../src/lib/types/undefined";

export const paint = {
    bgRed: paintImpl({ bg: 1 }),
    red: paintImpl({ fg: 1 }),

    bgGreen: paintImpl({ bg: 2 }),
    green: paintImpl({ fg: 2 }),

    gray: paintImpl({ fg: 8 }),
};

function paintImpl({ bg = Undefined<number>(), fg = Undefined<number>() }) {
    const prefix = "\x1b"
        + (bg === undefined ? "" : `[48;5;${bg}m`)
        + (fg === undefined ? "" : `[38;5;${fg}m`);
    const suffix = "\x1b[0m";

    return function (literals: TemplateStringsArray | string, ...placeholders: string[]) {
        if (typeof literals === "string") {
            return prefix + literals + suffix;
        }

        let result = "";

        for (let i = 0; i < placeholders.length; i++) {
            result += literals[i];
            result += placeholders[i];
        }

        result += literals[literals.length - 1];
        return prefix + result + suffix;
    };
}
