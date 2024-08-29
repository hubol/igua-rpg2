// new <T>(executor: (resolve: (value: T | PromiseLike<T>) => void, reject: (reason?: any) => void) => void): Promise<T>;

const clearContext = () => _currentContext = undefined;

export class Prommy<T> implements PromiseLike<T> {
    private readonly _context: any;
    private _promise: Promise<T>;

    constructor(
        executor: (resolve: (value: T | PromiseLike<T>) => void, reject: (reason?: any) => void) => void,
        context = _currentContext,
    ) {
        this._promise = new Promise<T>((resolve, reject) => {
            _currentContext = context;
            executor(resolve, reject);
        })
        .finally(clearContext);
        // this._promise = typeof executor === 'function' ? new Promise((resolve, reject) => {
        //     _currentContext = context;
        //     executor(resolve, reject);
        // }) : executor;
        this._context = context;
    }

    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | null | undefined, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | null | undefined): PromiseLike<TResult1 | TResult2> {
        // @ts-expect-error
        this._promise = this._promise.then(
            onfulfilled && ((value) => {
                _currentContext = this._context;
                const result = onfulfilled(value);
                return result;
            }),
            onrejected && ((reason) => {
                _currentContext = this._context;
                const result = onrejected(reason);
                return result;
            }))
            .finally(clearContext);
        
        return this as any;
        // const promise = this._promise.then(
        //     onfulfilled && ((value) => {
        //         _currentContext = this._context;
        //         return onfulfilled(value);
        //     }),
        //     onrejected && ((reason) => {
        //         _currentContext = this._context;
        //         return onrejected(reason);
        //     }))
        
        // return new Prommy(promise as any, this._context);
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