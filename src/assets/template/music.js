/**
@param {import("smooch/template-api").TemplateContext.AudioConvert} context;
@param {import("smooch/template-api").Utils} utils;
*/
module.exports = function ({ files }, { pascal, noext }) {
    return `
// This file is generated

export const GeneratedMusicData = {
${files.map(file =>
`   "${pascal(noext(file.path))}": { ogg: require("./ogg/${file.convertedPaths.ogg}") }`).join(`,
`)}
}`;
}