const { default: sceneExports } = require(`./scenes/**/*.ts`);

export function findSceneByName(name: string): () => unknown {
    for (const exports of sceneExports) {
        for (const key in exports) {
            const fn = exports[key];
            if (typeof fn === 'function' && fn.name === name)
                return fn;
        }
    }

    throw new Error(`Could not find Scene with name ${name}`);
}