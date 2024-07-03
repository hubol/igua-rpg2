const { serialize, createTree, literal } = require("./serialize-utils");
const { Cache } = require("./cache");

/**
 * @param {string} tint 
 * @returns {number | undefined}
 */
const getSerializableTint = (tint) => {
    const rawTint = tint;

    if (!tint)
        return undefined;
    if (tint.charAt(0) === '#')
        tint = tint.substring(1);
    if (tint.length !== 6) {
        console.warn(`Got bad tint: ${rawTint}`);
        return undefined;
    }
    return literal('0x' + tint);
}

const getSerializableOgmoEntityArgs = ({ name, id, _eid, originX, originY, tint, ...rest }) => ({ ...rest, tint: getSerializableTint(tint) });
const getSerializableOgmoDecalArgs = ({ texture, values, tint, ...rest }) => ({ ...rest, tint: getSerializableTint(tint) });

/**
@param {import("@hubol/smooch/template-api").TemplateContext.JsonAggregate} context;
@param {import("@hubol/smooch/template-api").Utils} utils;
*/
module.exports = function ({ files }, { pascal, noext, format }) {
    const { tree, node } = createTree();

    const decalNameCache = new Cache(texture => pascal(noext(texture)));
    const decalTexturePathCache = new Cache(texture => noext(texture).split("/").map(pascal).join("."));

    for (const { fileName, json } of files) {
        const path = fileName.split('/').filter(x => !!x);
        path[path.length - 1] = noext(path[path.length - 1]);

        /** @type Array */
        const entities = json.layers.reverse().flatMap(layer => layer.entities ?? layer.decals ?? []);

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
                ? `d(Tx.${decalTexturePathCache.get(entity.texture)}, ${serialize(getSerializableOgmoDecalArgs(entity), 0)})`
                : `e(r["${entity.name}"], ${serialize(getSerializableOgmoEntityArgs(entity), 0)})`
        }))

        const level = { width: json.width, height: json.height, backgroundTint: getSerializableTint(json.backgroundColor) }
        const obj = literal(`l(${serialize(level, 0)}, () => ({ ${resolveEntities.map(({ key, value }) => `"${key}": ${value},`).join('')} }))`)

        node(path.map(pascal), obj);
    }

    const stringifiedTree = serialize(tree).replace(/\\n/g, '\n');

    const source = `
// This file is generated

import { OgmoEntityResolvers as r } from '../../../igua/ogmo/entity-resolvers';
import { OgmoFactory } from '../../../igua/ogmo/factory';
import { Tx } from '../../../assets/textures';

const { createEntity: e, createDecal: d, createLevel: l } = OgmoFactory;

export const Lvl = ${stringifiedTree};
`;

    return format(source, { parser: 'typescript', printWidth: 500 });
}
