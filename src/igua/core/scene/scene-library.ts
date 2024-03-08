import { Logging } from "../../../lib/logging";

const { default: sceneExports } = require(`../../scenes/**/*.ts`);

type SceneLibraryImpl = Record<string, () => unknown>;
let sceneLibrary: SceneLibraryImpl;

function getNames() {
    ensureSceneLibrary();
    return Object.keys(sceneLibrary);
}

function findByName(name: string): () => unknown {
    ensureSceneLibrary();

    const scene = sceneLibrary[name];
    if (scene)
        return scene;
    
    throw new Error(`Could not find Scene with name ${name}`);
}

export const SceneLibrary = {
    findByName,
    getNames,
}

function ensureSceneLibrary() {
    if (sceneLibrary)
        return;
    
    sceneLibrary = createSceneLibrary();
    console.log(...Logging.componentArgs('SceneLibrary', sceneLibrary));
}

function createSceneLibrary(): SceneLibraryImpl {
    const sceneLibrary = {};
    for (const exports of sceneExports) {
        for (const key in exports) {
            const fn = exports[key];
            if (typeof fn === 'function')
                sceneLibrary[key] = fn;
        }
    }

    return sceneLibrary;
}