export class Prommy<T> implements PromiseLike<T> {
    private readonly _context: any;
    private _promise: Promise<T>;
    private _rootFulfilled = false;

    constructor(
        executor: (resolve: (value: T | PromiseLike<T>) => void, reject: (reason?: any) => void) => void,
        context = _currentContext,
        root = false,
    ) {
        const contextToRestore = _currentContext;

        this._promise = new Promise<T>((resolve, reject) => {
            _currentContext = context;
            executor(resolve, reject);
        })

        if (root) {
            this._promise = this._promise.finally(() => this._rootFulfilled = true);
        }

        this._context = context;

        _currentContext = contextToRestore;
    }

    static createRoot<T>(executor: () => PromiseLike<T>, context: any) {
        return new Prommy<T>((resolve, reject) => executor().then(resolve, reject), context, true);
    }

    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | null | undefined, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | null | undefined): PromiseLike<TResult1 | TResult2> {
        // @ts-expect-error
        this._promise = this._promise.then(
            onfulfilled && ((value) => {
                _currentContext = this._context;
                const result = onfulfilled(value);

                if (this._rootFulfilled)
                    _currentContext = undefined;
                return result;
            }),
            onrejected && ((reason) => {
                _currentContext = this._context;
                const result = onrejected(reason);

                if (this._rootFulfilled)
                    _currentContext = undefined;
                return result;
            }));
        
        return this as any;
    }
}

let _currentContext: any;

export class PrommyContext {
    private constructor() {

    }

    static current<TContext = any>(): TContext {
        return _currentContext;
    }
}