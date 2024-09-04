import ts from 'typescript';

// What the hell is this?!
// This takes await expressions where the operand is a Prommy
// e.g.
// await sleep(32)
// And transforms them into
// ($prommyResult = await sleep(32), $prommyPop(), $prommyResult)

const Consts = {
    ContextParameterName: '$c',
    ArgParameterNamePrefix: '$arg',
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
 * @param {import("typescript").Node} node
 */
function isFunctionDeclarationReturningPromise(node) {
    // It seems like functiondeclaration covers arrowfunction :-)
    // if (ts.isFunctionDeclaration(node) || ts.isArrowFunction(node))
    if (ts.isFunctionDeclaration(node))
        return doesNodeReturnPromise(node);

    return false;
}

/**
 * 
 * @param {import("typescript").Node} node
 */
function doesNodeReturnPromise(node) {
    const type = Ts.checker.getTypeAtLocation(node);
    for (const signature of type.getCallSignatures()) {
        if (signature.resolvedReturnType.symbol?.name === 'Promise') {
            return true;
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

/** @param {import("typescript").NodeFactory} factory  */
function createContextIdentifier(factory) {
    return factory.createIdentifier(Consts.ContextParameterName);
}

/**
 * @param {import("typescript").NodeFactory} factory 
 * @param {import("typescript").CallExpression} node
 */
function createCallExpressionWithPartiallyAppliedArguments(factory, node) {
    /** @type {import("typescript").Expression[]} */
    const argumentsArray = [];
    const parameters = Ts.checker.getResolvedSignature(node).parameters;

    for (let i = 0; i < node.arguments.length; i++) {
        const argument = node.arguments[i];
        if (!isIdentiferThatReturnsPromise(argument)) {
            argumentsArray.push(argument);
            continue;
        }

        const parameter = parameters[i];
        const provideableParametersLength = getLengthOfLongestParameterList(parameter.valueDeclaration);
        const receivableParametersLength = getLengthOfLongestParameterList(argument);

        const argCount = Math.min(provideableParametersLength, receivableParametersLength);
        const undefinedCount = receivableParametersLength - argCount;

        argumentsArray.push(createArrowFunctionCallingWithContextAndSpreadArgs(factory, argument, { argCount, undefinedCount }));
    }
    
    return factory.createCallExpression(
        node.expression,
        node.typeArguments,
        argumentsArray,
    );
}

function createArgParameterName(index) {
    return Consts.ArgParameterNamePrefix + index;
}

function range(x) {
    return [...new Array(x)].map((_, i) => i);
}


/**
 * @param {import("typescript").NodeFactory} factory 
 * @param {import("typescript").Identifier} node
 * @param {{ argCount: number, undefinedCount: number }} args
 */
function createArrowFunctionCallingWithContextAndSpreadArgs(factory, node, args) {
    return factory.createArrowFunction(
        undefined,
        undefined,
        range(args.argCount).map(i =>
            factory.createParameterDeclaration(
                undefined,
                undefined,
                createArgParameterName(i))
        ),
        undefined,
        factory.createToken(ts.SyntaxKind.EqualsGreaterThanToken),
        factory.createCallExpression(
            node,
            undefined,
            [
                ...range(args.argCount).map(i =>
                    factory.createIdentifier(createArgParameterName(i))
                ),
                ...range(args.undefinedCount).map(() =>
                    factory.createIdentifier('undefined')
                ),
                createContextIdentifier(factory),
            ]))
}

/**
 * @param {import("typescript").Node} node
 */
function getLengthOfLongestParameterList(node) {
    const type = Ts.checker.getTypeAtLocation(node);

    const signatures = type.isUnion() ? type.types.flatMap(union => union.getCallSignatures()) : type.getCallSignatures();

    let length = 0;

    for (const signature of signatures) {
        let thisLength = 0;
        for (const parameter of signature.parameters) {
            if (parameter.name !== Consts.ContextParameterName)
                thisLength++;
        }
        length = Math.max(length, thisLength);
    }

    return length;
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
 * 
 * @param {import("typescript").Node} node
 */
function isCallExpressionWithFunctionThatReturnsPromiseAsArgument(node) {
    if (ts.isCallExpression(node)) {
        for (const argument of node.arguments) {
            if (isIdentiferThatReturnsPromise(argument))
                return true;
        }
    }

    return false;
}

/**
 * 
 * @param {import("typescript").Node} node
 */
function isIdentiferThatReturnsPromise(node) {
    if (!ts.isIdentifier(node))
        return false;

    return doesNodeReturnPromise(node);
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

        if (isCallExpressionWithFunctionThatReturnsPromiseAsArgument(node)) {
            return ts.visitEachChild(createCallExpressionWithPartiallyAppliedArguments(factory, node), visitor, context);
        }

        if (isFunctionDeclarationReturningPromise(node)) {
            const acceptsContextArgument = oneSignatureHasContextParameter(node);
            if (!acceptsContextArgument)
                return ts.visitEachChild(createFunctionDeclarationWithContextParameter(factory, node), visitor, context);
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
