export class PrommyRoot {
    private readonly _context: any;
    private _promise: Promise<unknown>;
    private _resolve: (...args: any[]) => any;
    finalized = false;
    readonly _name: string;

    constructor(executor: () => Promise<unknown>, context: any) {
        this._name = `PrommyRoot ${rootIds++} (${executor.toString().substring(0, 12)})`;
        this._context = context;
        setContext2(this, 'new PrommyRoot');

        this._promise = new Promise((resolve) => this._resolve = resolve)
        .finally(() => {
            this.finalized = true;
            // setContext2(undefined, 'new PrommyRoot');
        });

        executor().catch(x => {});

        setContext2(undefined, 'new PrommyRoot POP')

        // setContext2(undefined, 'new PrommyRoot POP');
    }

    connect(promise: Promise<unknown>) {
        this._promise = this._promise.then(() => promise);

        if (this._resolve) {
            this._resolve();
            delete this._resolve;
        }

        return this._promise;
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

        this._promise = context.connect(new Promise(executor));
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

        // @ts-expect-error
        const nextPromise = this._promise.then(
            onfulfilled && (function(this: any) {
                // .then(() => setContext2(undefined, `${nextPromise._name}.then`))
                
                // setContext2(context, `${nextPromise._name}.onfulfilled`);

                try {
                    // TODO setImmediate does not exist in the browser. Can the asshat ticker supplement this?
                    return onfulfilled(new Promise(resolve => setImmediate(() => setContext2(context, `${nextPromise._name}.onfulfilled setTimeout`) || resolve())));
                  } finally {
                    // setContext2(undefined, `${nextPromise._name}.onfulfilled finally`);
                  }

                // console.log(typeof onfulfilled !== "function")

                // nextPromise.finally(() => {
                //     // setContext2(this._context, `${nextPromise._name}.onfulfilled`);
                //     onfulfilled(value);

                //     if (!this._context._finalized)
                //         setContext2(undefined, `${nextPromise._name}.onfulfilled 2`);
                // })

                // const result = onfulfilled(value);

                // console.log(onfulfilled.toString());

                // if (this._context._finalized)
                //     setContext2(undefined, `${nextPromise._name}.onfulfilled VARIANT 2`);
                // console.log(result)
                // return result;
            }),
            onrejected && ((reason) => {
                // setContext2(this._context, `${nextPromise._name}.onrejected`);

                // TODO Need to actually test this in tests!!!!!

                console.log('ONREJECTED?!?')
                const result = onrejected(reason);

                // if (this._context._finalized)
                //     setContext2(undefined, `${nextPromise._name}.onrejected VARIANT 2`);

                return result;
            }))
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

function setContext(context: any, debug: string) {
    // const prev = PrommyContext.current();
    // if (context === undefined)
    //     _currentContexts.pop();
    // else
    //     _currentContexts.push(context);

    // console.log(debug, prev, '->', PrommyContext.current());
    // _currentContext = context;
}

function setContext2(context?: PrommyContext, debug: string) {
    const prev = PrommyContext.current();
    if (context === undefined)
        _currentContexts.pop();
    else
        _currentContexts.push(context);

    console.log(debug, prev, '->', PrommyContext.current());
    // console.log(debug, PrommyContext.current(), '->', context);
    // _currentContext = context;
    // _currentContext = context;
}

let _currentContexts: PrommyRoot[] = [];
// let _currentContext: PrommyRoot;

export class PrommyContext {
    private constructor() {

    }

    static currentInternal(): PrommyRoot {
        // return _currentContext;
        return _currentContexts[_currentContexts.length - 1];
    }

    static current<TContext = any>(): TContext {
        // return _currentContext?._context;
        return _currentContexts[_currentContexts.length - 1]?._context;
    }
}