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
    private _notAwaited = false;
    private _promise: Promise<T>;

    constructor(
        executor: Promise<T> | ((resolve: (value: T | PromiseLike<T>) => void, reject: (reason?: any) => void) => void),
        context = PrommyContext.currentInternal(),
        info = executor.toString().substring(0, 16),
    ) {
        let name = context?._name ?? '';

        if (name)
            name += ' > '

        name += `Prommy ${ids++} (${info})`;

        console.log(`Prommy.constructor -- new Promise: ${name}`);

        // TODO need error handling?
        this._promise = typeof executor === 'function' ? new Promise(executor) : executor;

        this._promise._name = name;

        this._context = context;
    }

    static all<T extends readonly Prommy<unknown>[]>(values: T): Prommy<{ -readonly [P in keyof T]: Awaited<T[P]> }> {
        for (const value of values)
            value._notAwaited = true;
        return new Prommy(Promise.all(values));
    }

    static resolve<T>(value: T): Prommy<T>
    static resolve(): Prommy<void>
    static resolve<T>(value?: T) {
        return new Prommy(Promise.resolve(value));
    }

    static createRoot<T>(executor: () => Promise<T>, context: any) {
        return new PrommyRoot(executor, context);
    }

    and<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | null | undefined, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | null | undefined): Prommy<TResult1 | TResult2> {
        this._notAwaited = true;
        return this.then(onfulfilled, onrejected);
    }

    /**
     * @deprecated
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | null | undefined, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | null | undefined): PromiseLike<TResult1 | TResult2> {
        const parent = this._promise;
        const context = this._context;

        const nextPromise = this._promise.then(
            onfulfilled && ((value) => {
                if (this._notAwaited)
                    softApply(context);
                else
                    modifyRootStack(context, `${nextPromise._name} PUSH`);
                onfulfilled(value);
            }),
            onrejected)

        nextPromise._name = `${parent._name} > [Then ${thenIds++}]`;

        console.log(`Prommy.then: ${nextPromise._name}`);

        // @ts-expect-error
        this._promise = nextPromise;
        
        return this._promise;
    }
}

globalThis.Prommy = Prommy;

let thenIds = 0;
let ids = 0;
let rootIds = 0;

function modifyRootStack(root: PrommyRoot, debug: string) {
    _rootStack.push(root);

    const context = root?._context;
    const name = context?.name ?? context?.Name ?? context;
    console.log(debug + '; Stack Length: ' + _rootStack.length, '->', name);
}

export function applyStack() {
    const prev = PrommyContext.currentName();
    _appliedRoot = _rootStack.shift();

    console.log('Applied stack', prev, '->', PrommyContext.currentName(), '; Stack Length: ' + _rootStack.length);
}

function softApply(root: PrommyRoot) {
    const prev = PrommyContext.currentName();
    _appliedRoot = root;

    console.log('Soft applied', prev, '->', PrommyContext.currentName(), '; Stack Length: ' + _rootStack.length);
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
        return _appliedRoot?._context;
    }

    static get _internalStackLength() {
        return _rootStack.length;
    }
}