const LiteralSymbol = Symbol('Literal');

function literal(text) {
    return {
        text,
        __isLiteral: LiteralSymbol,
    }
}

const LiteralTokenStart = '@_LITERAL_START_@';
const LiteralTokenDoubleQuote = '@_LITERAL_DQUOTE_@';
const LiteralTokenEnd = '@_LITERAL_END_@';

const DoubleQuoteRegExp = /"/gm;
const DoubleQuoteSubstitutionRegExp = /@_LITERAL_DQUOTE_@/gm;

function replacer(_, value) {
    if (value?.__isLiteral === LiteralSymbol) {
        return LiteralTokenStart + value.text.replace(DoubleQuoteRegExp, LiteralTokenDoubleQuote) + LiteralTokenEnd;
    }

    return value;
}

const LiteralRegExp = /"@_LITERAL_START_@(.*?)@_LITERAL_END_@"/gm;
const substituteLiteral = (_, group) => group;

/**
 * @param {any} value 
 * @param {string | number | undefined} space 
 * @returns {string}
 */
function serialize(value, space = 1) {
    const stringified = JSON.stringify(value, replacer, space);
    return stringified
        .replace(DoubleQuoteSubstitutionRegExp, '"')
        .replace(LiteralRegExp, substituteLiteral);
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
                at[component] = i === path.length - 1 ? object : { };
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
 * @param {string} name
 * @param {any[]} args
 */
function functionCall(name, ...args) {
    return literal(`${name}(${args.map(JSON.stringify).join(",")})`);
}

const Literals = {
    functionCall,
}

exports.literal = literal;
exports.serialize = serialize;
exports.createTree = createTree;
exports.Literals = Literals;