const { serialize, createTree, literal } = require("./serialize-utils");
const { Cache } = require("./cache");

/**
@param {import("@hubol/smooch/template-api").TemplateContext.JsonAggregate} context;
@param {import("@hubol/smooch/template-api").Utils} utils;
*/
module.exports = function ({ files }, { pascal, noext, format }) {
    const { tree, node } = createTree();

    const getSerializableOgmoEntityArgs = ({ name, id, _eid, originX, originY, ...rest }) => rest;
    const getSerializableOgmoDecalArgs = ({ texture, values, ...rest }) => rest;

    const decalNameCache = new Cache(texture => pascal(noext(texture)));
    const decalTexturePathCache = new Cache(texture => noext(texture).split("/").map(pascal).join("."));

    for (const { fileName, json } of files) {
        const path = fileName.split('/').filter(x => !!x);
        path[path.length - 1] = noext(path[path.length - 1]);

        const width = json.width;
        const height = json.height;

        /** @type Array */
        const entities = json.layers.flatMap(layer => layer.entities ?? layer.decals ?? []).reverse();

        const encounteredNames = new Set();

        const getUniqueName = (entity) => {
            const base = entity.values?.name || entity.name || decalNameCache.get(entity.texture);
            let name = base;
            let suffix = 1;
            while (encounteredNames.has(name)) {
                name = base + "_" + suffix;
                suffix += 1;
            }

            encounteredNames.add(name);
            return name;
        }

        const resolveEntities = entities.map(entity => ({
            key: getUniqueName(entity),
            value: entity.texture
                ? `d(Tx.${decalTexturePathCache.get(entity.texture)}, ${JSON.stringify(getSerializableOgmoDecalArgs(entity))})`
                : `e(r["${entity.name}"], ${JSON.stringify(getSerializableOgmoEntityArgs(entity))})`
        }))

        const obj = {
            width,
            height,
            resolve: literal(`() => ({ ${resolveEntities.map(({ key, value }) => `"${key}": ${value},`).join('')} })`)
        };

        node(path.map(pascal), obj);
    }

    const stringifiedTree = serialize(tree);

    const source = `
// This file is generated

import { OgmoFactory } from '../../../igua/ogmo-factory';
import { Tx } from '../../../assets/textures';

const { entityResolvers: r, createEntity: e, createDecal: d } = OgmoFactory;

export const Lvl = ${stringifiedTree};
`;

    return format(source, { parser: 'typescript', printWidth: 500 });
}
