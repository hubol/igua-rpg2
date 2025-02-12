import { Pojo } from "../types/pojo";
import { deepEquals } from "./deep-equals";

type PropertyPath = string[];

export namespace Diff {
    export type Type = Array<{ path: PropertyPath; value: unknown }>;

    function isSearchable(value: unknown): value is object {
        // TODO i think there is a less stupid way to do this
        return Boolean(value) && typeof value === "object" && !Array.isArray(value) && !(value instanceof Set);
    }

    function createImpl(path: PropertyPath, previous: Pojo, next: Pojo, diff: Type) {
        for (const key in next) {
            const nextValue = next[key];
            const previousValue = previous?.[key];

            if (isSearchable(nextValue)) {
                if (previousValue) {
                    createImpl([...path, key], previousValue, nextValue, diff);
                }
                else {
                    diff.push({ path: [...path, key], value: nextValue });
                }
            }
            else if (!deepEquals(previousValue, nextValue)) {
                diff.push({ path: [...path, key], value: nextValue });
            }
        }
    }

    export function detectUpdatedValues(previous: Pojo, next: Pojo) {
        const diff: Type = [];
        createImpl([], previous, next, diff);
        return diff;
    }

    export function apply(object: Pojo, diff: Type) {
        const log: Array<{ path: PropertyPath; message: string }> = [];

        for (const { path, value } of diff) {
            let current = object;
            for (let i = 0; i < path.length - 1; i++) {
                const node = path[i];
                if (!current[node]) {
                    current[node] = {};
                }
                current = current[node];
            }

            if (!deepEquals(current[path.last], value)) {
                log.push({
                    path,
                    message: `Updated from ${JSON.stringify(current[path.last])} to ${JSON.stringify(value)}`,
                });
                current[path.last] = value;
            }
        }

        return log;
    }
}
