globalThis.$prommyResult = undefined;
globalThis.$prommyPop = applyStack;

export class PrommyRoot {
    private readonly _context: any;
    private _promise: Promise<unknown>;
    readonly _name: string;

    constructor(executor: () => Promise<unknown>, context: any) {
        this._name = `PrommyRoot ${rootIds++} (${executor.toString().substring(0, 12)})`;
        this._context = context;
        forceRoot(this, 'new PrommyRoot');

        // TODO figure out error handling
        this._promise = executor().catch(e => {});

        forceRoot(undefined, 'new PrommyRoot POP')
    }
}

export class Prommy<T> implements PromiseLike<T> {
    private readonly _context: PrommyRoot;
    private _promise: Promise<T>;

    constructor(
        executor: (resolve: (value: T | PromiseLike<T>) => void, reject: (reason?: any) => void) => void,
        context = PrommyContext.currentInternal(),
        info = executor.toString().substring(0, 16),
    ) {
        let name = context?._name ?? '';

        if (name)
            name += ' > '

        name += `Prommy ${ids++} (${info})`;

        console.log(`Prommy.constructor -- new Promise: ${name}`);

        // TODO need error handling?
        this._promise = new Promise(executor);

        this._promise._name = name;

        this._context = context;
    }

    static createRoot<T>(executor: () => Promise<T>, context: any) {
        return new PrommyRoot(executor, context);
    }

    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | null | undefined, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | null | undefined): PromiseLike<TResult1 | TResult2> {
        const parent = this._promise;
        const context = this._context;

        const nextPromise = this._promise.then(
            onfulfilled && (function() {
                modifyRootStack(context, `${nextPromise._name} PUSH`);
                onfulfilled();
            }),
            onrejected)

        nextPromise._name = `${parent._name} > [Then ${thenIds++}]`;

        console.log(`Prommy.then: ${nextPromise._name}`);

        // @ts-expect-error
        this._promise = nextPromise;
        
        return this._promise;
    }
}

let thenIds = 0;
let ids = 0;
let rootIds = 0;

function modifyRootStack(root: PrommyRoot, debug: string) {
    _rootStack.push(root);

    const context = root._context;
    const name = context.name ?? context.Name ?? context;
    console.log(debug + '; Stack Length: ' + _rootStack.length, '->', name);
}

export function applyStack() {
    const prev = PrommyContext.currentName();
    _appliedRoot = _rootStack.shift();

    console.log('Applied stack', prev, '->', PrommyContext.currentName());
}

function forceRoot(root?: PrommyRoot, debug: string) {
    const prev = PrommyContext.currentName();
    _forcedRoot = root;

    console.log(debug, prev, '->', PrommyContext.currentName());
}

let _forcedRoot: PrommyRoot | undefined;
let _appliedRoot: PrommyRoot;
let _rootStack: PrommyRoot[] = [];

export class PrommyContext {
    private constructor() {

    }

    static currentName(): string {
        return this.currentInternal()?._context?.name ?? this.currentInternal()?._context?.Name ?? this.currentInternal()?._context;
    }

    static currentInternal(): PrommyRoot {
        if (_forcedRoot)
            return _forcedRoot;
        return _appliedRoot;
    }

    static current<TContext = any>(): TContext {
        if (_forcedRoot)
            return _forcedRoot?._context;
        return _appliedRoot._context;
    }
}