import { Logging } from "../../../lib/logging";

const { default: sceneExports } = require(`../../scenes/**/*.ts`);

type SceneLibraryImpl = Record<string, () => unknown>;
let sceneLibrary: SceneLibraryImpl;

function getNames() {
    ensureSceneLibrary();
    return Object.keys(sceneLibrary);
}

function maybeFindByName(name: string): (() => unknown) | null {
    ensureSceneLibrary();

    const scene = sceneLibrary[name];
    if (scene) {
        return scene;
    }

    return null;
}

function findByName(name: string): () => unknown {
    const scene = maybeFindByName(name);
    if (!scene) {
        throw new Error(`Could not find Scene with name ${name}`);
    }
    return scene;
}

export const SceneLibrary = {
    maybeFindByName,
    findByName,
    getNames,
};

function ensureSceneLibrary() {
    if (sceneLibrary) {
        return;
    }

    sceneLibrary = createSceneLibrary();
    console.log(...Logging.componentArgs("SceneLibrary", sceneLibrary));
}

function createSceneLibrary(): SceneLibraryImpl {
    const sceneLibrary = {};
    for (const exports of sceneExports) {
        for (const key in exports) {
            const fn = exports[key];
            if (typeof fn === "function") {
                sceneLibrary[key] = fn;
            }
        }
    }

    return sceneLibrary;
}
