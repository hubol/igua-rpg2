export const DevUrl = {
    get sceneName() {
        const params = new URLSearchParams(window.location.search);
        return params.get("sceneName");
    },
    set sceneName(value) {
        if (!value) {
            return;
        }

        updateUrlSearchParam("sceneName", value);
    },
};

function updateUrlSearchParam(paramName: string, value: string) {
    const params = new URLSearchParams(window.location.search);
    params.set(paramName, value);

    const newUrl = new URL(window.location.href);
    newUrl.search = params.toString();

    window.history.replaceState(null, "", newUrl.href);
}
