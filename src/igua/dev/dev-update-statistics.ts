import { Integer } from "../../lib/math/number-alias-types";
import { DevFsClient } from "./dev-fs-client";

const path = "src/igua/dev/data/statistics.json";

export async function devUpdateStatistics() {
    const dataStatistics = getStatistics(
        require(`../data/**/*.ts`),
        (key, value) =>
            key.toLowerCase().startsWith("data") && typeof value === "object"
            && ("manifest" in value || "Manifest" in value),
        (key) => key.substring("data".length),
        (value) =>
            Object.keys(value.manifest ?? value.Manifest)
                .filter(value => !value.includes("__"))
                .length,
    );

    const sceneStatistics = getStatistics(
        require(`../scenes/**/*.ts`),
        (key, value) => key.toLowerCase().startsWith("scn") && typeof value === "function",
        () => "Scene",
        () => 1,
    );

    const enemyStatistics = getStatistics(
        require(`../objects/enemies/**/*.ts`),
        (key, value) => key.toLowerCase().startsWith("objangel") && typeof value === "function",
        () => "Enemy",
        () => 1,
    );

    const statistics = getObjectSortedByKeys({
        ...sceneStatistics,
        ...enemyStatistics,
        ...dataStatistics,
    });

    const existing = await DevFsClient.readJson(path);

    const date = await DevFsClient.readGitCommitDate();
    const next = getObjectSortedByKeys(
        {
            ...existing,
            [date.toISOString().substring(0, 10)]: statistics,
        },
    );

    const values = Object.values(next);

    for (let i = 0; i < values.length - 1; i++) {
        if (values[i + 1] !== statistics) {
            continue;
        }

        if (JSON.stringify(values[i]) === JSON.stringify(values[i + 1])) {
            return;
        }
    }

    if (JSON.stringify(existing) === JSON.stringify(next)) {
        return;
    }

    await DevFsClient.writeJson(path, next);
}

function getStatistics(
    modules: { default: Array<any> },
    filter: (key: string, value: any) => boolean,
    getId: (key: string) => string,
    getCount: (value: any) => Integer,
) {
    const result: Record<string, Integer> = {};

    const allModules = modules.default
        .flatMap(module => Object.entries(module));

    for (const [key, value] of allModules) {
        if (!filter(key, value)) {
            continue;
        }

        const id = getId(key);
        const count = getCount(value);

        result[id] ??= 0;
        result[id] += count;
    }

    return result;
}

function getObjectSortedByKeys<T extends Record<string, unknown>>(obj: T): T {
    return Object.keys(obj)
        .sort()
        .reduce((_obj, key) => {
            // @ts-expect-error Shut up
            _obj[key] = obj[key];
            return _obj;
        }, {} as T);
}
