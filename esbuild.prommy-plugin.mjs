import { transformFile, initializeTs } from './esbuild.prommy.mjs'

/** @type {import("esbuild").Plugin} */
export const prommyPlugin = {
    name: 'prommy',
    setup(build) {
        build.onStart(initializeTs);
        build.onLoad({ filter: /\.ts$/ }, async ({ path }) => {
            const contents = transformFile(path);

            return {
            contents,
            loader: 'ts',
            }
        })
    },
}