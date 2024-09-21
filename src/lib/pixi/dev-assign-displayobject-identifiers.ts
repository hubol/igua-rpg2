import { DisplayObject } from "pixi.js";

export function devAssignDisplayObjectIdentifiers(constructed: DisplayObject) {
    const error = new Error();
    const [name, stack] = getDisplayObjectStack(error);

    error.stack = stack;

    constructed["Name"] = name;
    constructed["Stack"] = stack;
}

const matchFnNameRegExp = new RegExp(/\s+at\s(?:Object\.)?((?:new\s)?[a-zA-Z0-9_\.]*)\s\(.*\)/y);

function getDisplayObjectStack(e: Error) {
    const stack = e.stack!;

    let result = "";
    let name = "";

    let index = stack.indexOf("\n");

    while (index > -1) {
        index += 1;
        matchFnNameRegExp.lastIndex = index;
        const current = matchFnNameRegExp.exec(stack);

        let fnCallLooksUnimportant = false;

        if (current) {
            const match = current[1];

            if (
                match === "devAssignDisplayObjectIdentifiers" || match.startsWith("new _") || match === "container"
                || match === "_Container2" || match === "_Sprite.from"
            ) {
                fnCallLooksUnimportant = true;
            }

            if ((!name || name.startsWith("Array.")) && !fnCallLooksUnimportant && !match.startsWith("new ")) {
                name = match + (name ? " " : "") + name;
            }
        }

        const nextIndex = stack.indexOf("\n", index);

        if (!fnCallLooksUnimportant) {
            result += stack.substring(index, nextIndex === -1 ? undefined : nextIndex + 1);
        }

        index = nextIndex;
    }

    return [name ?? "<No name>", result ? "GetStackError\n" + result : stack];
}
