import { build, context } from 'esbuild';

const serve = process.argv[2] === 'serve';

/** @type {import('esbuild').BuildOptions} */
const options = {
    entryPoints: ['src/index.ts'],
    outdir: 'public',
    assetNames: 'assets/[name]-[hash]',
    bundle: true,
    loader: {
        '.png': 'file',
        '.zip': 'file',
    },
    logLevel: 'info',
}

if (!serve) {
    await build(options);
}
else {
    const ctx = await context(options);

    await ctx.watch();
    await ctx.serve({ servedir: 'public' });
}