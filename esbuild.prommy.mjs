import path from 'path';
import ts from 'typescript';

const Consts = {
    PopFunctionName: '$prommyPop',
    ResultIdentifier: '$prommyResult',
    PrommyType: 'Prommy',
}

const Ts = {
    /** @type {import("typescript").Program} */
    program: undefined,
    /** @type {import("typescript").TypeChecker} */
    checker: undefined,
    printer: ts.createPrinter(),
}

/**
 * 
 * @param {import("typescript").NodeFactory} factory 
 * @returns 
 */
function createFunctionCall(factory) {
    return factory.createCallExpression(
        factory.createIdentifier(Consts.PopFunctionName),
        undefined,
        []
    );
}

/**
 * @param {import("typescript").NodeFactory} factory 
 * @param {import("typescript").AwaitExpression} awaitExpr 
 * @returns 
 */
function createAwaitReplacement(factory, awaitExpr) {
    const resultVariable = factory.createIdentifier(Consts.ResultIdentifier);
    const assignment = factory.createAssignment(resultVariable, awaitExpr);

    // Create the replacement expression: (result = <await expression>, someFunctionCall(), result)
    return factory.createParenthesizedExpression(
        factory.createCommaListExpression([
            assignment,
            createFunctionCall(factory),
            resultVariable
        ])
    );
}

/**
 * 
 * @param {import("typescript").Type} type 
 */
function isPrommyOrPromiseOfPrommy(type) {
    // Check if the type itself is Prommy
    if (type.symbol && type.symbol.name === Consts.PrommyType) {
        return true;
    }

    // Check if the type is Promise<T>
    if (type.symbol && type.symbol.name === 'Promise') {
        const typeArguments = type.aliasTypeArguments;
        if (typeArguments && typeArguments.length > 0) {
            const innerType = typeArguments[0];
            if (isPrommyOrPromiseOfPrommy(innerType)) {
                return true;
            }
        }
    }

    // Check if the type is a union type containing Prommy
    if (type.flags & ts.TypeFlags.Union) {
        const unionTypes = type.types;
        return unionTypes.some(unionType => isPrommyOrPromiseOfPrommy(unionType));
    }

    return false;
}

/**
 * 
 * @param {import("typescript").TransformationContext} context 
 * @returns 
 */
const transformSourceFile = (context) => (sourceFile) => {
    const { factory } = context;

    // A visitor function to traverse the AST
    function visitor(node) {
        if (ts.isAwaitExpression(node)) {
            const expression = node.expression;
            const type = Ts.checker.getTypeAtLocation(expression);

            if (isPrommyOrPromiseOfPrommy(type)) {
                return createAwaitReplacement(factory, node);
            }
        }
        return ts.visitEachChild(node, visitor, context);
    }

    return ts.visitNode(sourceFile, visitor);
}

const windowsPathSeparatorRegExp = /\\/g;

/**
 * 
 * @param {string} path 
 */
function normalizeWindowsPathSeparator(path) {
    return path.replace(windowsPathSeparatorRegExp, '/');
}

/**
 * 
 * @param {string} fileName 
 * @returns {string}
 */
export function transformFile(fileName) {
    fileName = normalizeWindowsPathSeparator(fileName);
    
    for (const sourceFile of Ts.program.getSourceFiles()) {
        sourceFile.fileName = normalizeWindowsPathSeparator(sourceFile.fileName);
    }
    
    const sourceFile = Ts.program.getSourceFiles().find(sf => fileName.includes(sf.fileName));

    if (!sourceFile)
        throw new Error(`Could not find ${fileName}`);

    const result = ts.transform(sourceFile, [transformSourceFile]);

    return Ts.printer.printFile(result.transformed[0]);
}

const tsconfigPath = './tsconfig.json';
const tsconfig = ts.readConfigFile(tsconfigPath, ts.sys.readFile);
if (tsconfig.error) {
    throw new Error(`Failed to read tsconfig.json: ${tsconfig.error.messageText}`);
}

const parsedTsConfig = ts.parseJsonConfigFileContent(tsconfig.config, ts.sys, path.dirname(tsconfigPath));

export function initializeTs() {
    Ts.program = ts.createProgram(parsedTsConfig.fileNames, parsedTsConfig.options);
    Ts.checker = Ts.program.getTypeChecker();
}
