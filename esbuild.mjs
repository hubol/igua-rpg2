import { build, context } from 'esbuild';
import { copyFile, readFile, writeFile } from 'fs/promises';
import ImportGlobPlugin from 'esbuild-plugin-import-glob';

const serve = process.argv[2] === 'serve';

/**
 * @param {import('esbuild').BuildOptions} overrides 
 * @returns {import('esbuild').BuildOptions}
 */
function options(overrides) {
    /** @type {import('esbuild').BuildOptions} */
    const options = {
        entryPoints: ['src/index.ts'],
        assetNames: 'assets/[name]-[hash]',
        bundle: true,
        sourcemap: true,
        loader: {
            '.fnt': 'file',
            '.png': 'file',
            '.zip': 'file',
        },
        logLevel: 'info',
        plugins: [
            ImportGlobPlugin.default(),
        ],
        ...overrides,
    }

    return options;
}

if (!serve) {
    // Naive cache busting
    const signature = Date.now();

    await build(options({
        outdir: 'dist',
        assetNames: `assets/[name]-${signature}`,
        entryNames: `[name]-${signature}`,
        define: { IS_PRODUCTION: 'true' }
    }));

    const indexHtmlSource = (await readFile('public/index.html', 'utf8'))
        .replace(/index.css/gm, `index-${signature}.css`)
        .replace(/index.js/gm, `index-${signature}.js`);

    await writeFile('dist/index.html', indexHtmlSource);
    await copyFile('public/index.css', `dist/index-${signature}.css`);
}
else {
    const ctx = await context(options({
        outdir: 'public',
        define: { IS_PRODUCTION: 'false' }
    }));

    await ctx.watch();
    await ctx.serve({ servedir: 'public' });
}