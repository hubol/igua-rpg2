import { Pojo } from "../types/pojo";

export function deepUpgradeVerbose<TPojo extends Pojo>(
    previousVersionObject: unknown,
    nextVersionObject: TPojo,
) {
    const auditLog = new AuditLog();
    const upgradedObject = {} as TPojo;

    deepUpgradeVerboseImpl([], previousVersionObject, nextVersionObject, upgradedObject, auditLog);

    // Slightly strange API
    // but no one cares
    return { upgradedObject, messages: auditLog.messages, rawMessages: auditLog.rawMessages };
}

type InferredType = { type: "object"; keys: string[] } | { type: "array" } | { type: "set" } | { type: "null" } | {
    type: "string" | "number" | "bigint" | "boolean" | "symbol" | "undefined" | "object" | "function";
};

function inferType(value: any): InferredType {
    if (value === null) {
        return { type: "null" };
    }

    if (Array.isArray(value)) {
        return { type: "array" };
    }
    if (value instanceof Set) {
        return { type: "set" };
    }

    const type = typeof value;

    if (type === "object") {
        return { type, keys: value ? Object.keys(value) : [] };
    }

    return { type };
}

function deepUpgradeVerboseImpl(path: PropertyPath, previous: any, next: any, upgraded: any, auditLog: AuditLog) {
    const previousType = inferType(previous);
    const nextType = inferType(next);

    if (!previous && nextType.type !== previousType.type) {
        if (!path.length) {
            throw new Error("falsy previousVersionObject is not supported. Must at least be an empty Pojo!");
        }

        auditLog.push(path, `Previous not set, using next value ${JSON.stringify(next)}`);
        upgraded[path.last] = next;
        return;
    }

    if (previousType.type !== nextType.type) {
        if (nextType.type === "null") {
            // Assume this value is a union of null | something else
            upgraded[path.last] = previous;
            return;
        }

        auditLog.push(
            path,
            `Previous type ${previousType.type} does not match next type ${nextType.type}, using next value ${
                JSON.stringify(next)
            }`,
        );

        upgraded[path.last] = next;
        return;
    }

    const type = nextType.type;

    if (type !== "object") {
        upgraded[path.last] = previous;
        return;
    }

    const upgradedNextLevel = path.length ? upgraded[path.last] = {} : upgraded;

    for (const key in previous) {
        if (!(key in next)) {
            auditLog.push([...path, key], `Present in previous value, but not in next value. Dropping.`);
        }
    }

    for (const key in next) {
        deepUpgradeVerboseImpl([...path, key], previous[key], next[key], upgradedNextLevel, auditLog);
    }
}

type PropertyPath = string[];

class AuditLog {
    private readonly _messages: Array<{ path: PropertyPath; message: string }> = [];

    get messages() {
        return this._messages.map(({ path, message }) => `${path.join(".")}: ${message}`);
    }

    get rawMessages() {
        return this._messages;
    }

    push(path: PropertyPath, message: string) {
        this._messages.push({ path, message });
    }
}
