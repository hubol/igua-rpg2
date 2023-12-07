import { build, context } from 'esbuild';

const serve = process.argv[2] === 'serve';

function options(define = {}) {
    /** @type {import('esbuild').BuildOptions} */
    const options = {
        entryPoints: ['src/index.ts'],
        outdir: 'public',
        assetNames: 'assets/[name]-[hash]',
        define,
        bundle: true,
        sourcemap: true,
        loader: {
            '.png': 'file',
            '.zip': 'file',
        },
        logLevel: 'info',
    }

    return options;
}

if (!serve) {
    await build(options({ IS_PRODUCTION: 'true' }));
}
else {
    const ctx = await context(options({ IS_PRODUCTION: 'false' }));

    await ctx.watch();
    await ctx.serve({ servedir: 'public' });
}