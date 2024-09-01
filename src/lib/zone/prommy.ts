function asap(fn: () => void) {
    Promise.resolve().then(fn);
}

export class PrommyRoot {
    private readonly _context: any;
    private _promise: Promise<unknown>;
    readonly _name: string;

    constructor(executor: () => Promise<unknown>, context: any) {
        this._name = `PrommyRoot ${rootIds++} (${executor.toString().substring(0, 12)})`;
        this._context = context;
        setContext3(this, 'new PrommyRoot');

        // TODO figure out error handling
        this._promise = executor().catch(e => {});

        setContext3(undefined, 'new PrommyRoot POP')

        // setContext2(undefined, 'new PrommyRoot POP');
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
        if (!context)
            console.error('No context!');

        let name = context?._name ?? '';

        if (name)
            name += ' > '

        name += `Prommy ${ids++} (${info})`;

        console.log(`Prommy.constructor -- new Promise: ${name}`);

        this._promise = new Promise(executor);
        // .finally(() => {
        //     setContext2(undefined, 'wtf');
        // })

        this._promise._name = name;

        // if (root) {
        //     this._promise = this._promise.finally(() => this._rootFulfilled = true);
        // }

        this._context = context;

        // setContext2(undefined, 'Restored');
    }

    static createRoot<T>(executor: () => Promise<T>, context: any) {
        return new PrommyRoot(executor, context);
        // return new Prommy<T>((resolve, reject) => executor().then(resolve, reject), context, true, executor.toString().substring(0, 16));
    }

    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | null | undefined, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | null | undefined): PromiseLike<TResult1 | TResult2> {
        const parent = this._promise;
        const context = this._context;

        const nextPromise = this._promise.then(
            onfulfilled && (function() {
                asap(() => {
                    setContext2(context, `${nextPromise._name} PUSH`);
                    onfulfilled()
                    // TODO doesn't work in engine...
                    // Only passes tests...
                    // Might be related to how requestAnimationFrame works with ticks?
                    asap(() => setContext2(undefined, `${nextPromise._name} asap POP`));
                });
            }),
            onrejected)
            // .then(y => console.log('y', y))
            // .finally(x => console.log('x', x))

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

function setContext2(context?: PrommyRoot, debug: string) {
    const prev = PrommyContext.currentName();
    if (context === undefined)
        _currentContexts.shift();
    else
        _currentContexts.push(context);

    console.log(debug, prev, '->', PrommyContext.currentName());
    // console.log(debug, PrommyContext.current(), '->', context);
    // _currentContext = context;
    // _currentContext = context;
}

function setContext3(context?: PrommyRoot, debug: string) {
    const prev = PrommyContext.currentName();
    forcedSyncContext = context;

    console.log(debug, prev, '->', PrommyContext.currentName());
    // console.log(debug, PrommyContext.current(), '->', context);
    // _currentContext = context;
    // _currentContext = context;
}

let forcedSyncContext: PrommyRoot | undefined;

let _currentContexts: PrommyRoot[] = [];
// let _currentContext: PrommyRoot;

export class PrommyContext {
    private constructor() {

    }

    static currentName(): string {
        return this.currentInternal()?._context?.name ?? this.currentInternal()?._context;
    }

    static currentInternal(): PrommyRoot {
        if (forcedSyncContext)
            return forcedSyncContext;
        // return _currentContext;
        return _currentContexts[0];
    }

    static current<TContext = any>(): TContext {
        if (forcedSyncContext)
            return forcedSyncContext?._context;
        // return _currentContext?._context;
        return _currentContexts[0]?._context;
    }
}