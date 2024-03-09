const { serialize, createTree, Literals } = require("./serialize-utils");

/**
@param {import("@hubol/smooch/template-api").TemplateContext.TexturePack} context;
@param {import("@hubol/smooch/template-api").Utils} utils;
*/
module.exports = function ({ atlases, textures }, { pascal, noext, format }) {
    const atlasIndices = {};
    for (let i = 0; i < atlases.length; i += 1) {
        const atlas = atlases[i];
        atlasIndices[atlas.fileName] = i;
    }

    const { tree, node } = createTree();

    for (const tx of textures) {
        const path = tx.fileName.split('/').filter(x => !!x);
        const fileName = noext(path[path.length - 1]);

        path[path.length - 1] = fileName;

        const id = path.map(pascal).join(".");
        const object = { id, atlas: atlasIndices[tx.atlasFileName], x: tx.x, y: tx.y, width: tx.width, height: tx.height };

        const call = Literals.functionCall('tx', object);

        node(path.map(pascal), call);
    }

    const stringifiedTree = serialize(tree);

    const source = `
// This file is generated

const atlases = [ ${atlases.map(x => `{ url: require("./${x.fileName}"), texturesCount: ${x.rects.length} }`).join(', ')} ];

interface TxData {
    id: string;
    atlas: number;
    x: number;
    y: number;
    width: number;
    height: number;
}

function txs<T>(tx: (data: TxData) => T) {
    return ${stringifiedTree}
}

export const GeneratedTextureData = {
    atlases,
    txs,
}
`;

    return format(source, { parser: 'typescript', printWidth: 2000 });
}
