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

const getSerializableOgmoEntityArgs = ({ layerName, name, id, _eid, originX, originY, tint, ...rest }) => ({ ...rest, tint: getSerializableTint(tint) });
const getSerializableOgmoDecalArgs = ({ layerName, texture, values, tint, decal, groupName, ...rest }) => ({ ...rest, ...(groupName ? { groupName } : {}), tint: getSerializableTint(tint) });

/**
@param {import("@hubol/smooch/template-api").TemplateContext.JsonAggregate} context;
@param {import("@hubol/smooch/template-api").Utils} utils;
*/
module.exports = function ({ files }, { pascal, noext, format }) {
    const { tree, node } = createTree();

    const decalNameCache = new Cache(texture => pascal(noext(texture)));
    const decalTexturePathCache = new Cache(texture => noext(texture).split("/").map(pascal).join("."));

    const types = [];

    for (const { fileName, json } of files) {
        const path = fileName.split('/').filter(x => !!x);
        path[path.length - 1] = noext(path[path.length - 1]);

        /** @type Array */
        const entities = json.layers.reverse().flatMap(layer => (layer.entities ?? layer.decals ?? []).map(obj => ({ ...obj, layerName: layer.name })));

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

        /** @type {Record<string, { x: number, y: number, key: string, value: string }>} */
        const groups = {}

        const resolveEntities = entities.flatMap(entity => {
            const resolvedEntity = {
                key: getUniqueName(entity),
                value: entity.texture
                    ? `d(Tx.${decalTexturePathCache.get(entity.texture)}, ${serialize(getSerializableOgmoDecalArgs(entity), 0)}, "${entity.layerName}")`
                    : `e(r["${entity.name}"], ${serialize(getSerializableOgmoEntityArgs(entity), 0)}, "${entity.layerName}")`,
            };

            const existingGroup = groups[entity.groupName]

            if (!entity.texture || !entity.groupName || existingGroup) {
                if (existingGroup) {
                    existingGroup.x = Math.min(existingGroup.x, entity.x);
                    existingGroup.y = Math.min(existingGroup.y, entity.y);
                }

                return [resolvedEntity];
            }

            const resolvedGroup = {
                key: getUniqueName({ name: pascal(entity.groupName) }),
                x: entity.x,
                y: entity.y,
                get value() {
                    return `dg(${this.x}, ${this.y}, "${entity.groupName}", "${entity.layerName}")`
                },
            };

            groups[entity.groupName] = resolvedGroup;

            return [
                resolvedGroup,
                resolvedEntity,
            ];
        });

        const level = { width: json.width, height: json.height, backgroundTint: getSerializableTint(json.backgroundColor) }
        const obj = literal(`() => { applyLevel(${serialize(level, 0)}); return { ${resolveEntities.map(({ key, value }) => `"${key}": ${value},`).join('')} }; }`)

        const pascalPath = path.map(pascal);
        node(pascalPath, obj);
        types.push(`export type ${pascalPath.join('_')} = ReturnType<typeof Lvl${pascalPath.map(pathNode => `["${pathNode}"]`).join("")}>;`)
    }

    const stringifiedTree = serialize(tree);

    const source = `
// This file is generated

import { OgmoEntityResolvers as r } from '../../../igua/ogmo/entity-resolvers';
import { OgmoFactory } from '../../../igua/ogmo/factory';
import { Tx } from '../../../assets/textures';

const { createEntity: e, createDecal: d, applyLevel, createDecalGroup: dg } = OgmoFactory;

export const Lvl = ${stringifiedTree};

export namespace LvlType {
${types.join('\n')}
}
`;

    return format(source, { parser: 'typescript', printWidth: 500 });
}
