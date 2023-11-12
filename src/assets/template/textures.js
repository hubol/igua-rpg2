/**
@param {import("@hubol/smooch/template-api").TemplateContext.TexturePack} context;
@param {import("@hubol/smooch/template-api").Utils} utils;
*/
module.exports = function ({ atlases, textures }, { pascal, noext }) {
    const atlasIndices = {};
    for (let i = 0; i < atlases.length; i += 1) {
        const atlas = atlases[i];
        atlasIndices[atlas.fileName] = i;
    }

    return `
// This file is generated

const atlases = [ ${atlases.map(x => `require("./${x.fileName}")`).join(', ')} ];

const txs = {
${textures.map(tx =>
`   "${pascal(noext(tx.fileName))}": { atlas: ${atlasIndices[tx.atlasFileName]}, x: ${tx.x}, y: ${tx.y}, width: ${tx.width}, height: ${tx.height} }`).join(`,
`)}
}

export const GeneratedTextureData = {
    atlases,
    txs,
}
`;
}