// new <T>(executor: (resolve: (value: T | PromiseLike<T>) => void, reject: (reason?: any) => void) => void): Promise<T>;

// const clearContext = () => _currentContext = undefined;
const clearContext = () => {
    console.log('clearContext');
    _currentContext = undefined;
};

export class Prommy<T> implements PromiseLike<T> {
    private readonly _context: any;
    private _promise: Promise<T>;

    constructor(
        executor: (resolve: (value: T | PromiseLike<T>) => void, reject: (reason?: any) => void) => void,
        context = _currentContext,
    ) {
        const contextToRestore = _currentContext;

        this._promise = new Promise<T>((resolve, reject) => {
            setContext(context, 'new Promise');
            executor(resolve, reject);
        })
        .finally(() => setContext(undefined, 'new Promise.finally'));
        this._context = context;

        setContext(contextToRestore, 'Restored');
    }

    static createRoot<T>(executor: () => PromiseLike<T>, context: any) {
        return new Prommy<T>((resolve, reject) => executor().then(resolve, reject), context);
        // return new Prommy<T>(async (resolve, reject) => {
        //     try {
        //         _currentContext = context;
        //         resolve(await executor());    
        //     }
        //     catch (e) {
        //         reject(e);
        //     }
        // }, null)
    }

    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | null | undefined, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | null | undefined): PromiseLike<TResult1 | TResult2> {
        // @ts-expect-error
        this._promise = this._promise.then(
            onfulfilled && ((value) => {
                setContext(this._context, 'onfulfilled');
                const result = onfulfilled(value);
                // console.log(result)
                return result;
            }),
            onrejected && ((reason) => {
                setContext(this._context, 'onrejected');
                const result = onrejected(reason);
                return result;
            }))
            .finally(() => setContext(undefined, 'this._promise.then.finally'));
        
        return this as any;
    }
}

function setContext(context: any, debug: string) {
    console.log(debug, _currentContext, '->', context);
    _currentContext = context;
}

let _currentContext: any;

export class PrommyContext {
    private constructor() {

    }

    static current<TContext = any>(): TContext {
        return _currentContext;
    }
}