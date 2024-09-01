import { transformFile, initializeTs } from './esbuild.prommy.mjs'

/** @type {import("esbuild").Plugin} */
export const prommyPlugin = {
    name: 'prommy',
    setup(build) {
      build.onStart(initializeTs);
      build.onLoad({ filter: /\.ts$/ }, async (args) => {
        const contents = transformFile(args.path);
        console.log('Transformed', args.path);

        return {
          contents,
          loader: 'ts',
        }
      })
    },
  }