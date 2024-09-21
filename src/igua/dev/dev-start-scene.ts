export const DevStartScene = {
    get name() {
        const params = new URLSearchParams(window.location.search);
        return params.get("sceneName");
    },
    set name(value) {
        if (!value) {
            return;
        }

        const params = new URLSearchParams(window.location.search);
        params.set("sceneName", value);

        const newUrl = new URL(window.location.href);
        newUrl.search = params.toString();

        window.history.replaceState(null, "", newUrl.href);
    },
};
