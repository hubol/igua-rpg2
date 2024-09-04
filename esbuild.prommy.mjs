import ts from 'typescript';

// What the hell is this?!
// This takes await expressions where the operand is a Prommy
// e.g.
// await sleep(32)
// And transforms them into
// ($prommyResult = await sleep(32), $prommyPop(), $prommyResult)

const Consts = {
    ContextParameterName: '$c',
    PopFunctionName: '$prommyPop',
    ResultIdentifier: '$prommyResult',
    PrommyType: 'Prommy',
}

const Ts = {
    /** @type {import("typescript").WatchOfConfigFile<import("typescript").BuilderProgram>} */
    watch: undefined,
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
function createPopFunctionCall(factory) {
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
function createPoppingAwaitExpression(factory, awaitExpr) {
    const resultVariable = factory.createIdentifier(Consts.ResultIdentifier);
    const assignment = factory.createAssignment(resultVariable, awaitExpr);

    return factory.createParenthesizedExpression(
        factory.createCommaListExpression([
            assignment,
            createPopFunctionCall(factory),
            resultVariable
        ])
    );
}

/**
 * @param {import("typescript").NodeFactory} factory 
 * @param {import("typescript").AwaitExpression} awaitExpr 
 * @returns 
 */
function createPoppingAwaitExpressionOfWrappedPrommy(factory, awaitExpr) {
    const resultVariable = factory.createIdentifier(Consts.ResultIdentifier);

    const promise = awaitExpr.expression;
    const constructed = factory.createNewExpression(factory.createIdentifier(Consts.PrommyType), undefined, [ promise ])
    const awaited = factory.createAwaitExpression(constructed);

    const assignment = factory.createAssignment(resultVariable, awaited);


    return factory.createParenthesizedExpression(
        factory.createCommaListExpression([
            assignment,
            createPopFunctionCall(factory),
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
 * @param {import("typescript").Node} node
 */
function isFunctionDeclarationReturningPromise(node) {
    if (ts.isFunctionDeclaration(node) || ts.isArrowFunction(node)) {
        const type = Ts.checker.getTypeAtLocation(node);
        for (const signature of type.getCallSignatures()) {
            if (signature.resolvedReturnType.symbol?.name === 'Promise') {
                return true;
            }
        }
    }

    return false;
}

/**
 * 
 * @param {import("typescript").Node} node
 */
function oneSignatureHasContextParameter(node) {
    const type = Ts.checker.getTypeAtLocation(node);
    return type.callSignatures.some(signature => signature.parameters.some(parameter => parameter.name === Consts.ContextParameterName));
}

/**
 * @param {import("typescript").NodeFactory} factory 
 * @param {import("typescript").Node} node
 */
function createFunctionDeclarationWithContextParameter(factory, node) {
    if (ts.isFunctionDeclaration(node)) {
        return factory.createFunctionDeclaration(
            node.modifiers,
            node.asteriskToken,
            node.name,
            node.typeParameters,
            [ ...node.parameters, factory.createParameterDeclaration(undefined, undefined, '$c') ],
            node.type,
            node.body);
    }

    return factory.createArrowFunction(
        node.modifiers,
        node.typeParameters,
        [ ...node.parameters, factory.createParameterDeclaration(undefined, undefined, '$c') ],
        node.type,
        node.equalsGreaterThanToken,
        node.body,
    )
}

const results = {
    callChains: [],
    callExpressions: [],
    callLikeExpressions: [],
    callOrNewExpressions: [],
}

const promiseMethods = new Set([ 'then', 'catch', 'finally' ]);

/**
 * 
 * @param {import("typescript").Node} node
 */
function isInvocationOfFunctionThatReturnsPromise(node) {
    if (ts.isCallExpression(node)) {
        const expressionSymbol = Ts.checker.getTypeAtLocation(node.expression).symbol;

        if (promiseMethods.has(expressionSymbol?.name))
            return false;
        if (expressionSymbol?.parent?.name === 'PromiseConstructor')
            return false;
        if (Ts.checker.getTypeAtLocation(node).symbol?.name === 'Promise')
            return true;
    }

    return false;
}

/**
 * @param {import("typescript").NodeFactory} factory 
 * @param {import("typescript").CallExpression} node
 */
function createCallExpressionWithContextParameter(factory, node) {
    return factory.createCallExpression(
        node.expression,
        node.typeArguments,
        [ ...node.arguments, factory.createIdentifier(Consts.ContextParameterName) ]);
}

/**
 * 
 * @param {import("typescript").TransformationContext} context 
 * @returns 
 */
const transformSourceFile = (context) => (sourceFile) => {
    const { factory } = context;

    /**
     * 
     * @param {import("typescript").Node} node
     */
    function visitor(node) {
        if (isInvocationOfFunctionThatReturnsPromise(node)) {
            return ts.visitEachChild(createCallExpressionWithContextParameter(factory, node), visitor, context);
        }

        if (isFunctionDeclarationReturningPromise(node)) {
            const acceptsContextArgument = oneSignatureHasContextParameter(node);
            if (!acceptsContextArgument)
                return ts.visitEachChild(createFunctionDeclarationWithContextParameter(factory, node), visitor, context);
        }

        if (ts.isAwaitExpression(node)) {
            const expression = node.expression;
            const type = Ts.checker.getTypeAtLocation(expression);

            // if (type.symbol?.name === 'Promise') {
            //     return ts.visitEachChild(createPoppingAwaitExpressionOfWrappedPrommy(factory, node), visitor, context);
            // }

            // if (isPrommyOrPromiseOfPrommy(type)) {
            //     return createPoppingAwaitExpression(factory, node);
            // }
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

    if (transformedTextCache.has(fileName))
        return transformedTextCache.get(fileName);

    console.log('Transforming ' + fileName);
    
    const sourceFile = Ts.program.getSourceFiles().find(sf => fileName.includes(sf.fileName));

    if (!sourceFile)
        throw new Error(`Could not find ${fileName}`);

    const result = ts.transform(sourceFile, [transformSourceFile]);

    const newSourceText = Ts.printer.printFile(result.transformed[0]);
    transformedTextCache.set(fileName, newSourceText);

    return newSourceText;
}

export function initializeTs() {
    Ts.program = Ts.watch.getProgram().getProgram();
    Ts.checker = Ts.program.getTypeChecker();
}

const configPath = ts.findConfigFile(
    /*searchPath*/ "./",
    ts.sys.fileExists,
    "tsconfig.json"
);
if (!configPath) {
    throw new Error("Could not find a valid 'tsconfig.json'.");
}

const EmitResult = Object.seal({
    emitSkipped: true,
    diagnostics: [],
})

const transformedTextCache = new Map();

// Creates a BuilderProgram that returns a nonstandard Program
// It captures calls to emit to expire the transformedTextCache
// Also it normalizes source file file names
const fubarBuilderProgram = (...args) => {
    const builderProgram = ts.createEmitAndSemanticDiagnosticsBuilderProgram(...args);
    const _getProgram = builderProgram.getProgram;
    builderProgram.getProgram = (...args) => {
        const program = _getProgram(...args);
        program.emit = ({ fileName }) => {
            transformedTextCache.delete(fileName);
            return EmitResult;
        }

        for (const sourceFile of program.getSourceFiles()) {
            sourceFile.fileName = normalizeWindowsPathSeparator(sourceFile.fileName);
        }

        return program;
    }

    return builderProgram;
}

const host = ts.createWatchCompilerHost(
    configPath,
    {},
    ts.sys,
    fubarBuilderProgram,
    () => {},
    () => {},
);

// Only observed this being called when incremental was true
// But maybe it's best to log it for now...
host.writeFile = (...args) => console.log('Not writing file', args[0]);

Ts.watch = ts.createWatchProgram(host);
