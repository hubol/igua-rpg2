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

const cache = {};

/**
 * @typedef {{ kind: 'cache_hit' }} Command_CacheHit
 * @typedef {{ kind: 'compose_error', fileName: string, error: Error }} Command_ComposeError
 * @typedef {{ kind: 'write', updateCache: () => void, tsFile: { fileName: string, text: string } }} Command_Write
 * @typedef {Command_CacheHit | Command_ComposeError | Command_Write} Command
 */

/**
@param {import("@hubol/smooch/template-api").TemplateContext.JsonAggregate} context;
@param {import("@hubol/smooch/template-api").Utils} utils;
*/
module.exports = async function ({ files }, utils) {
    const { Fs } = utils;
    const getLevelTsFile = createGetLevelTsFile(utils);

    const commandPromises = files.map(async file => {
        const cacheKey = file.fileName;

        const value = cache[cacheKey];
        const json = JSON.stringify(file.json);

        if (value === json) {
            return {
                kind: 'cache_hit',
            };
        }

        try {
            const tsFile = await getLevelTsFile(file);

            return {
                kind: 'write',
                updateCache: () => cache[cacheKey] = json,
                tsFile,
            }
        }
        catch (error) {
            return {
                kind: 'compose_error',
                fileName: file.fileName,
                error,
            }
        }
    });

    /** @type {Command[]} */
    const commands = await Promise.all(commandPromises);

    /** @type {Command_CacheHit[]} */
    const cacheHitCommands = commands.filter(command => command.kind === 'cache_hit');
    /** @type {Command_ComposeError[]} */
    const composeErrorCommands = commands.filter(command => command.kind === 'compose_error');
    /** @type {Command_Write[]} */
    const writeCommands = commands.filter(command => command.kind === 'write');

    const writeResults = await Promise.allSettled(writeCommands.map(async command => {
        await Fs.writeFile(command.tsFile.fileName, command.tsFile.text);
        console.log('Wrote', command.tsFile.fileName);
    }));

    const writeSuccesses = writeResults.filter(result => result.status === 'fulfilled');
    const writeErrors = writeResults.flatMap((result, index) => result.status === 'fulfilled'
        ? []
        : [{ fileName: writeCommands[index].tsFile.fileName, error: result.reason }]
    )

    if (composeErrorCommands.length) {
        console.error(`-- TS compose errors --`);
        printErrors(composeErrorCommands);
        console.error(`-- End TS compose errors --`);
    }

    if (writeErrors.length) {
        console.error(`-- TS write errors --`);
        printErrors(writeErrors);
        console.error(`-- End TS write errors --`);
    }

    console.log(`${writeSuccesses.length} level TS file(s) were successfully rewritten.`);
    console.log(`${cacheHitCommands.length} level TS file(s) did not require regenerating.`);

    return `// This file is generated
`;
}

/** 
 * @param {{ error: Error, fileName: string }[]} errors 
*/
function printErrors(errors) {
    for (let i = 0; i < errors.length; i++) {
        const { error, fileName } = errors[i];
        console.error(`#${i + 1} ${fileName}: ${error.name} ${error.message}`);
    }
}

/**
 * @param {import("@hubol/smooch/template-api").Utils} utils
 */
function createGetLevelTsFile(utils) {
    const { format, kebab, noext, pascal, Fs } = utils;
    const decalNameCache = new Cache(texture => pascal(noext(texture)));
    const decalTexturePathCache = new Cache(texture => noext(texture).split("/").map(pascal).join("."));

    /**
    * @param {{ fileName: string, json: object }} file
    */
    async function getLevelTsFile({ fileName, json }) {
        const name = getLevelName(fileName, utils);
        const camelName = `lvl${name}`;

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

        const resolvedGroupNames = new Set();

        const resolveEntities = entities.flatMap(entity => {
            const resolvedEntity = {
                key: getUniqueName(entity),
                value: entity.texture
                    ? `d(Tx.${decalTexturePathCache.get(entity.texture)}, ${serialize(getSerializableOgmoDecalArgs(entity), 0)}, "${entity.layerName}")`
                    : `e(r["${entity.name}"], ${serialize(getSerializableOgmoEntityArgs(entity), 0)}, "${entity.layerName}")`,
            };

            if (!entity.texture || !entity.groupName || resolvedGroupNames.has(entity.groupName)) {
                return [resolvedEntity];
            }

            const resolvedGroup = {
                key: getUniqueName({ name: pascal(entity.groupName) }),
                value: `dg("${entity.groupName}", "${entity.layerName}")`,
            };

            resolvedGroupNames.add(entity.groupName);

            return [
                resolvedGroup,
                resolvedEntity,
            ];
        });

        const level = { width: json.width, height: json.height, backgroundTint: getSerializableTint(json.backgroundColor) }

        const source = `// This file is generated

import { OgmoEntityResolvers as r } from '../../../igua/ogmo/entity-resolvers';
import { OgmoFactory } from '../../../igua/ogmo/factory';
import { Tx } from '../../../assets/textures';

const { createEntity: e, createDecal: d, applyLevel, createDecalGroup: dg } = OgmoFactory;

export const ${camelName} = () => { applyLevel(${serialize(level, 0)}); return { ${resolveEntities.map(({ key, value }) => `"${key}": ${value},`).join('')} }; };

export type Lvl${name} = ReturnType<typeof ${camelName}>;
`

        return {
            fileName: Fs.resolve('src/assets/generated/levels/', kebab(camelName) + '.ts'),
            text: await format(source, { parser: 'typescript', printWidth: 500 }),
        }
    }

    return getLevelTsFile;
}

/**
* @param {string} fileName
* @param {import("@hubol/smooch/template-api").Utils} utils
*/
function getLevelName(fileName, { pascal, noext }) {
    const path = fileName.split('/').filter(x => !!x);
    path[path.length - 1] = noext(path[path.length - 1]);

    return pascal(path.join(' '));
}
