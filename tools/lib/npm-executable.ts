const isWindows = /^win/.test(process.platform);

export const NpmExecutable = {
    npm: isWindows ? "npm.cmd" : "npm",
    npx: isWindows ? "npx.cmd" : "npx",
};
