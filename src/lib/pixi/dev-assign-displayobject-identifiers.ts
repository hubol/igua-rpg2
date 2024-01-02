import { DisplayObject } from "pixi.js";

export function devAssignDisplayObjectIdentifiers(constructed: DisplayObject) {
    const error = new Error();
    constructed['Stack'] = getDisplayObjectStack(error);
}

const regex = new RegExp(/(?:Error)?\s+at\s((?:new\s)?[a-zA-Z0-9_\.]*)\s\(.*\)/gm);

function getDisplayObjectStack(e: Error) {
    let current: RegExpExecArray;
    let result = '';

    while ((current = regex.exec(e.stack!)!) !== null) {
        const match = current[1];

        if (match === 'devAssignDisplayObjectIdentifiers' || match.startsWith('new _') || match === 'container')
            continue;

        if (result)
            result += ' < ';
        result += match;
    }

    return result;
}