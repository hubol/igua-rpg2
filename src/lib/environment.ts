import packageJson from "../../package.json";

export const Environment = {
    isProduction: IS_PRODUCTION,
    get isDev() {
        return !Environment.isProduction;
    },
    get isElectron() {
        // https://github.com/electron/electron/issues/2288#issuecomment-337858978
        return navigator.userAgent.toLowerCase().indexOf(" electron/") > -1;
    },
    get isSafari() {
        // https://stackoverflow.com/a/7768006
        return /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    },
    get version() {
        return packageJson.version;
    },
    get isRunningFromItchCdn() {
        return window.location.href.includes("hwcdn");
    },
    get requiresUserGestureForSound() {
        return Environment.isProduction && !Environment.isElectron;
    },
};
