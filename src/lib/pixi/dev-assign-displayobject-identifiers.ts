import { DisplayObject } from "pixi.js";

export function devAssignDisplayObjectIdentifiers(constructed: DisplayObject) {
    const error = new Error();
    const [ name, stack ] = getDisplayObjectStack(error);
    constructed['Name'] = name;
    constructed['Stack'] = stack;
    constructed['Throwable'] = error;
}

const regex = new RegExp(/(?:Error)?\s+at\s(?:Object\.)?((?:new\s)?[a-zA-Z0-9_\.]*)\s\(.*\)/gm);

function getDisplayObjectStack(e: Error) {
    let current: RegExpExecArray;
    let stack = '';
    let name = '';

    while ((current = regex.exec(e.stack!)!) !== null) {
        const match = current[1];

        if (match === 'devAssignDisplayObjectIdentifiers' || match.startsWith('new _') || match === 'container')
            continue;

        if (!name && !match.startsWith('new '))
            name = match;

        if (stack)
            stack += ' < ';
        stack += match;
    }

    return [ name, stack ];
}