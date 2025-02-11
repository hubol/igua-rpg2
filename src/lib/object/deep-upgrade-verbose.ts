import { Pojo } from "../types/pojo";

export function deepUpgradeVerbose<TPojo extends Pojo>(
    previousVersionObject: unknown,
    nextVersionObject: TPojo,
) {
    const auditLog = new AuditLog();
    const upgradedObject = {} as TPojo;

    deepUpgradeVerboseImpl([], previousVersionObject, nextVersionObject, upgradedObject, auditLog);

    return { upgradedObject, messages: auditLog.messages };
}

type InferredType = { type: "object"; keys: string[] } | { type: "array" } | { type: "set" } | {
    type: "string" | "number" | "bigint" | "boolean" | "symbol" | "undefined" | "object" | "function";
};

function inferType(value: any): InferredType {
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
    if (!previous) {
        if (!path.length) {
            throw new Error("falsy previousVersionObject is not supported. Must at least be an empty Pojo!");
        }

        auditLog.push(path, `Previous not set, using next value ${JSON.stringify(next)}`);
        upgraded[path.last] = next;
        return;
    }

    const previousType = inferType(previous);
    const nextType = inferType(next);

    if (previousType.type !== nextType.type) {
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
    readonly messages: string[] = [];

    push(path: PropertyPath, message: string) {
        this.messages.push(`${path.join(".")}: ${message}`);
    }
}
