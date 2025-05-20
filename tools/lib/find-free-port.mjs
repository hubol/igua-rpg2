import { createServer } from "net";
import { networkInterfaces } from "os";

const consts = {
    highestPort: 65535,
    retriedPortOffset: 100,
};

/**
 * @param {number} port
 */
export async function findFreePort(port) {
    const hosts = getLocalHostAddresses();

    const portMax = Math.min(consts.highestPort, port + consts.retriedPortOffset);
    const reasons = new Set();
    for (let p = port; p <= portMax; p++) {
        const result = await isPortAvailable(p, hosts);
        if (result.available) {
            return p;
        }
        reasons.add(result.reason);
    }

    throw new Error(`Failed to find a free port in range [${port} - ${portMax}]:
${[...reasons].join("\n")}`);
}

/**
 * @param {number} port
 * @param {string[]} hosts
 * @returns {Promise<{ available: true } | { available: false, reason: string }>}
 */
async function isPortAvailable(port, hosts) {
    try {
        for (const host of hosts) {
            const server = await openServer(port, host);
            await closeServer(server);
        }
    }
    catch (error) {
        return { available: false, reason: `${error}` };
    }

    return { available: true };
}

/**
 * @param {number} port
 * @param {string} host
 * @returns {Promise<import("net").Server>}
 */
function openServer(port, host) {
    return new Promise((resolve, reject) => {
        const server = createServer()
            .on("error", (error) => {
                reject(error);
            })
            .listen({ port, host }, () => resolve(server));
    });
}

/**
 * @param {import("net").Server} server
 * @returns {Promise<void>}
 */
function closeServer(server) {
    return new Promise((resolve, reject) => {
        server.close((error) => error ? reject(error) : resolve());
    });
}

// I saw several implementations of a find free port mechanism
// they all seemed to have something like this!
// https://github.com/sindresorhus/get-port/blob/5c3cfe828bac345fb30b13211164708d97cb033a/index.js#L26-L40
function getLocalHostAddresses() {
    const interfaceInfos = networkInterfaces();

    const addresses = new Set([undefined, "0.0.0.0"]);

    for (const interfaceInfo of Object.values(interfaceInfos)) {
        for (const config of interfaceInfo) {
            addresses.add(config.address);
        }
    }

    return [...addresses];
}
