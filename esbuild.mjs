import { build, context } from "esbuild";
import ImportGlobPlugin from "esbuild-plugin-import-glob";
import { copyFile, readFile, writeFile } from "fs/promises";
import { createServer, request } from "http";
import path from "path";
import { cwd } from "process";
import { findFreePort } from "./tools/lib/find-free-port.mjs";
import { startParcelWatcher } from "./tools/lib/start-parcel-watcher.mjs";

const serve = process.argv[2] === "serve";

/**
 * @param {import('esbuild').BuildOptions} overrides
 * @returns {import('esbuild').BuildOptions}
 */
function options(overrides) {
    /** @type {import('esbuild').BuildOptions} */
    const options = {
        entryPoints: ["src/index.ts"],
        assetNames: "assets/[name]-[hash]",
        bundle: true,
        sourcemap: true,
        loader: {
            ".ogg": "file",
            ".png": "file",
            ".zip": "file",
            ".html": "text",
        },
        logLevel: "info",
        plugins: [
            ImportGlobPlugin.default(),
        ],
        ...overrides,
    };

    return options;
}

if (!serve) {
    // Naive cache busting
    const signature = Date.now();

    await build(options({
        outdir: "dist",
        assetNames: `assets/[name]-${signature}`,
        entryNames: `[name]-${signature}`,
        define: { IS_PRODUCTION: "true" },
    }));

    const indexHtmlSource = (await readFile("public/index.html", "utf8"))
        .replace(/index.css/gm, `index-${signature}.css`)
        .replace(/index.js/gm, `index-${signature}.js`);

    await writeFile("dist/index.html", indexHtmlSource);
    await copyFile("public/index.css", `dist/index-${signature}.css`);
}
else {
    const ctx = await context(options({
        outdir: "public",
        define: { IS_PRODUCTION: "false" },
    }));

    await watch(ctx);

    const esbuildServerPort = await findFreePort(9000 + Math.round(Math.random() * 1000));
    const esbuildServer = await ctx.serve({ servedir: "public", port: esbuildServerPort });
    const proxy = createEsbuildProxy(esbuildServer);

    const port = await findFreePort(8000);

    const server = createServer((req, res) => {
        if (isFsRequest(req)) {
            void handleFsRequest(req, res);
            return;
        }

        proxy.inject(req, res);
    })
        .listen({ port }, () => {
            console.clear();
            console.log(`Listening on ${getServerAddressText(server)}`);
        });
}

/**
 * @param {import("http").IncomingMessage} req
 */
function isFsRequest(req) {
    return Boolean(req.url) && req.url.startsWith("/fs/");
}

/**
 * @param {import("http").IncomingMessage} req
 * @param {import("http").ServerResponse} res
 */
async function handleFsRequest(req, res) {
    const requestedPath = "." + req.url.substring("/fs".length);
    const absolutePath = path.resolve(requestedPath);

    if (!absolutePath.startsWith(cwd())) {
        res.writeHead(403);
        res.end("Don't you do it!");
        return;
    }

    try {
        if (req.method === "GET") {
            const buffer = await readFile(absolutePath);
            res.writeHead(200);
            res.end(buffer);
        }
        else if (req.method === "POST") {
            const body = await readBody(req);
            await writeFile(absolutePath, body);
            res.writeHead(202);
            res.end("Accepted");
        }
        else {
            res.writeHead(404);
            res.end("Not found");
        }
    }
    catch (error) {
        console.error(`${req.method} ${req.url} failed:`);
        console.error(error);
        res.writeHead(500);
        res.end(`${error}`);
    }
}

/**
 * @param {import("http").IncomingMessage} req
 * @returns {Promise<Buffer>}
 */
function readBody(req) {
    return new Promise(resolve => {
        const chunks = [];
        req.on("data", (chunk) => chunks.push(chunk))
            .on("end", () => resolve(Buffer.concat(chunks)));
    });
}

/**
 * @param {import("esbuild").ServeResult} esbuildServer
 */
function createEsbuildProxy(esbuildServer) {
    /**
     * @param {import("http").IncomingMessage} req
     * @param {import("http").ServerResponse} res
     */
    function inject(req, res) {
        const options = {
            hostname: esbuildServer.host,
            port: esbuildServer.port,
            path: req.url,
            method: req.method,
            headers: req.headers,
        };

        const proxyReq = request(options, proxyRes => {
            res.writeHead(proxyRes.statusCode, proxyRes.headers);
            proxyRes.pipe(res, { end: true });
        });

        req.pipe(proxyReq, { end: true });
    }

    return {
        inject,
    };
}

/**
 * @param {import("http").Server} server
 */
function getServerAddressText(server) {
    const address = server.address();
    if (!address) {
        return "<null>";
    }
    if (typeof address === "string") {
        return address;
    }
    // Probably not correct, but I don't understand networking :-)
    return `http://localhost:${address.port}`;
}

/**
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
 * @param {() => boolean} predicate
 */
function wait(predicate) {
    if (predicate()) {
        return;
    }

    let interval;

    return new Promise(r => {
        interval = setInterval(() => {
            if (predicate()) {
                r();
            }
        });
    })
        .finally(() => clearInterval(interval));
}
