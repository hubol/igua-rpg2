/**
@param {import("smooch/template-api").TemplateContext.AudioConvert} context;
@param {import("smooch/template-api").Utils} utils;
*/
module.exports = function ({ files }, { pascal, noext }) {
    return `
// This file is generated

export const GeneratedSfxData = {
${files.map(file =>
`   "${pascal(noext(file.path))}": { ogg: "${file.convertedPaths.ogg}" }`).join(`,
`)}
}`;
}