export function onViewportResize(fn: () => void) {
    document.documentElement.addEventListener("resize", fn);
    window.addEventListener("resize", fn);
}

export function forceViewportResize() {
    document.documentElement.dispatchEvent(new Event("resize"));
}
