import { Null } from "../../lib/types/null";

const paramNames = {
    hasDevFeatures: "dev",
    sceneName: "sceneName",
};

export const DevUrl = {
    get hasDevFeatures() {
        return getCurrentUrlSearchParams().has(paramNames.hasDevFeatures);
    },
    get sceneName() {
        return getCurrentUrlSearchParams().get(paramNames.sceneName);
    },
    set sceneName(value) {
        if (!value) {
            return;
        }

        updateUrlSearchParam(paramNames.sceneName, value);
    },
};

const getCurrentUrlSearchParams = (() => {
    let cacheKey = Null<string>();
    let cacheValue = Null<URLSearchParams>();

    return function (): Pick<URLSearchParams, "get" | "has"> {
        const key = window.location.search;
        if (key === cacheKey) {
            return cacheValue!;
        }

        cacheKey = key;
        return cacheValue = new URLSearchParams(key);
    };
})();

function updateUrlSearchParam(paramName: string, value: string) {
    const params = new URLSearchParams(window.location.search);
    params.set(paramName, value);

    const newUrl = new URL(window.location.href);
    newUrl.search = params.toString();

    window.history.replaceState(null, "", newUrl.href);
}
