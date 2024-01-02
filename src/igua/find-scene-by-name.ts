import { Logging } from "../lib/logging";

const { default: sceneExports } = require(`./scenes/**/*.ts`);

type SceneLibrary = Record<string, () => unknown>;
let sceneLibrary: SceneLibrary;

export function findSceneByName(name: string): () => unknown {
    if (!sceneLibrary) {
        sceneLibrary = createSceneLibrary();
        console.log(...Logging.componentArgs('SceneLibrary', sceneLibrary));
    }

    const scene = sceneLibrary[name];
    if (scene)
        return scene;
    
    throw new Error(`Could not find Scene with name ${name}`);
}

function createSceneLibrary(): SceneLibrary {
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