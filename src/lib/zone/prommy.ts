const defaultContext = {};

export const PrommyRuntime = {
    install() {
        globalThis.$c = defaultContext;
    },
    isDefaultContext(context: any) {
        return context === defaultContext;
    },
}
