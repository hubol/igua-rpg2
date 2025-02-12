function areArraysDeepEqual(value0: unknown[], value1: unknown[]) {
    if (value0.length !== (value1 as unknown[]).length) {
        return false;
    }

    for (let i = 0; i < value0.length; i++) {
        if (!deepEquals(value0[i], (value1 as unknown[])[i])) {
            return false;
        }
    }

    return true;
}

export function deepEquals(value0: unknown, value1: unknown) {
    if (value0 === value1) {
        return true;
    }

    if ((!value0 && value1) || (value0 && !value1)) {
        return false;
    }

    const type = typeof value0;
    if (type !== typeof value1) {
        return false;
    }

    if (type === "object") {
        if (value0!.constructor !== value1!.constructor) {
            return false;
        }

        if (Array.isArray(value0)) {
            return areArraysDeepEqual(value0, value1 as unknown[]);
        }

        if (value0 instanceof Set) {
            if (value0.size !== (value1 as Set<unknown>).size) {
                return false;
            }

            return areArraysDeepEqual([...value0].sort(), [...value1 as Set<unknown>].sort());
        }

        const keys0 = Object.keys(value0 as object);
        const keys1 = Object.keys(value1 as object);

        if (keys0.length !== keys1.length) {
            return false;
        }

        for (const key of keys0) {
            if (!deepEquals((value0 as object)[key], (value1 as object)[key])) {
                return false;
            }
        }

        return true;
    }

    return false;
}
