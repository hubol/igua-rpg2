const { serialize, createTree, literal } = require("./serialize-utils");

/**
@param {import("@hubol/smooch/template-api").TemplateContext.AudioConvert} context;
@param {import("@hubol/smooch/template-api").Utils} utils;
*/
module.exports = function ({ files }, { pascal, noext, format }) {
    const oggFiles = [];
    const { tree, node } = createTree();

    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const path = file.path.split('/').filter(x => !!x);
        const fileName = noext(path[path.length - 1]);

        path[path.length - 1] = fileName;

        oggFiles.push(file.convertedPaths.ogg);
        node(path.map(pascal), literal(`sounds[${i}]`));
    }

    const serialized = serialize(tree);

    const source = `
// This file is generated

async function sfxs<T>(sfx: (ogg: string) => Promise<T>) {
    const sounds = await Promise.all(${JSON.stringify(oggFiles)}.map(sfx));
    return ${serialized}
}

export const GeneratedSfxData = {
    sfxs,
}`;

    return format(source, { parser: 'typescript', printWidth: 100 });
}