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
        const metadata = getMetadata(fileName); // TODO remove probably

        const leafName = metadata ? metadata.name : fileName;

        path[path.length - 1] = leafName;

        const id = path.map(pascal).join(".");
        const object = { id, atlas: atlasIndices[tx.atlasFileName], x: tx.x, y: tx.y, width: tx.width, height: tx.height };

        const call = serializeCall('tx', object);

        node(path.map(pascal), call);
    }

    const stringifiedTree = stringifyTree(tree, 2);

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

function serializeCall(fn, args) {
    return {
        fn,
        args,
    }
}

function stringifyTree(tree, indent = 0, root = true) {
    if (tree._branch || root) {
        return `{
${Object.entries(tree).filter(([ key ]) => key !== '_branch').map(([ key, value ]) => `"${key}": ${stringifyTree(value, indent + 1, false)},`).join('\n')}
}`
    }

    return stringifyLeaf(tree);
}

function stringifyLeaf({ fn, args }) {
    return fn + '(' + JSON.stringify(args) + ')';    
}

function createTree() {
    const tree = { };

    /**
     * 
     * @param {string[]} path 
     * @param {Record<string, any>} object 
     */
    function node(path, object) {
        let at = tree;

        for (let i = 0; i < path.length; i += 1) {
            const component = path[i];

            if (!at[component])
                at[component] = i === path.length - 1 ? object : { _branch: true };
            at = at[component];
        }
    }

    return {
        tree,
        node,
    }
}

/**
 * 
 * @param {string} fileName 
 */
function getMetadata(fileName) {
    if (fileName.indexOf("_") === -1)
        return undefined;

    const components = fileName.split("_");
    return {
        name: components[0],
        subimages: Number(components[1]),
    }
}