// new <T>(executor: (resolve: (value: T | PromiseLike<T>) => void, reject: (reason?: any) => void) => void): Promise<T>;

// const clearContext = () => _currentContext = undefined;
const clearContext = () => {
    console.log('clearContext');
    _currentContext = undefined;
};

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

        const id = ids++;

        this._promise = new Promise<T>((resolve, reject) => {
            setContext(context, 'new Promise');
            executor(resolve, reject);
        })

        if (root) {
            this._promise = this._promise.finally(() => this._rootFulfilled = true);
        }
        // .finally(() => console.log(`new Promise${id}.finally`));

        this._promise._id = id;

        console.log(`new Promise${this._promise._id}`, executor.toString())

        // .finally(() => setContext(undefined, 'new Promise.finally'));
        this._context = context;

        setContext(contextToRestore, 'Restored');
    }

    static createRoot<T>(executor: () => PromiseLike<T>, context: any) {
        return new Prommy<T>((resolve, reject) => executor().then(resolve, reject), context, true);
    }

    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | null | undefined, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | null | undefined): PromiseLike<TResult1 | TResult2> {
        const parent = this._promise;

        // @ts-expect-error
        const nextPromise = this._promise.then(
            onfulfilled && ((value) => {
                setContext(this._context, `Promise${nextPromise._id} (ParentPromise${parent._id}).onfulfilled`);
                const result = onfulfilled(value);

                if (this._rootFulfilled)
                    setContext(undefined, `Promise${nextPromise._id} (ParentPromise${parent._id}).onfulfilled VARIANT 2`);
                // console.log(result)
                return result;
            }),
            onrejected && ((reason) => {
                setContext(this._context, `Promise${nextPromise._id} (ParentPromise${parent._id}).onrejected`);
                const result = onrejected(reason);
                return result;
            }))
            .finally(() => {
                setContext(undefined, `Promise${nextPromise._id} (ParentPromise${parent._id}).then.finally`);
            });

        nextPromise._parent = parent;
        // @ts-expect-error
        nextPromise._id = ids++;

        // @ts-expect-error
        this._promise = nextPromise;
        
        return this as any;
    }
}

let ids = 0;

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