import { build, context } from 'esbuild';
import { copyFile, readFile, writeFile } from 'fs/promises';
import ImportGlobPlugin from 'esbuild-plugin-import-glob';
import { startParcelWatcher } from './tools/lib/start-parcel-watcher.mjs';

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
            '.ogg': 'file',
            '.png': 'file',
            '.zip': 'file',
            '.html': 'text',
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

    await watch(ctx);
    await ctx.serve({ servedir: 'public' });
}

/**
 * 
 * @param {import('esbuild').BuildContext<import('esbuild').BuildOptions>} ctx 
 */
async function watch(ctx) {
    const rebuildFn = makeEnqueuedPromiseFn("Rebuild", () => ctx.rebuild());

    if (await startParcelWatcher("./src", rebuildFn)) {
        console.log("Started @parcel/watcher");
        await rebuildFn();
    }
    else {
        console.log("Starting esbuild watch");
        await ctx.watch();
    }
}

/**
 * @param {string} name 
 * @param {() => Promise<unknown>} promiseFn
 */
function makeEnqueuedPromiseFn(name, promiseFn) {
    let isEnqueued = false;
    let isRunning = false;

    return async () => {
        if (isEnqueued) {
            console.log(`${name} already enqueued, skipping...`);
            return;
        }
        else if (isRunning) {
            console.log(`Enqueueing ${name}...`);
            isEnqueued = true;
        }
        
        await wait(() => !isRunning && (isRunning = true));

        console.log(`Running ${name}...`);
        isEnqueued = false;

        try {
            await promiseFn();
        }
        catch (e) {
            console.error(`Error during ${name}\n`, e);
        }

        isRunning = false;
    };
}

/**
 * 
 * @param {() => boolean} predicate 
 */
function wait(predicate) {
    if (predicate())
        return;

    let interval;

    return new Promise(r => {
        interval = setInterval(() => {
            if (predicate())
                r();
        });
    })
    .finally(() => clearInterval(interval));
}
