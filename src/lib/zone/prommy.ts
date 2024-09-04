import { ErrorReporter } from "../game-engine/error-reporter";
import { Force } from "../types/force";
import { ForceAliasType } from "../types/force-alias-type";

const PrommyGlobal = {
    $root: Force<PrommyRoot>(),
    $push,
    $pop,
}

let installed = false;

export function installPrommy() {
    if (installed)
        return;

    installed = true;

    globalThis.$p = PrommyGlobal;
    redefinePromise();

    return { $p: PrommyGlobal };
}

export const Prommy = {
    createRoot,
    create,
}

export const _Internal_Prommy = {
    create: create as <T> (...args: Parameters<typeof create<T>>) => Prommy<T> & PrivatePromise,
}

function createRoot<T>(executor: () => Promise<T>, context: any) {
    return new PrommyRoot(executor, context);
}

type Prommy<T> = ForceAliasType<Promise<T>>;

function create<T>(executor: (resolve: (value: T | PromiseLike<T>) => void, reject: (reason?: any) => void) => void): Prommy<T> {
    const p = new Promise<T>(executor) as Prommy<T> & PrivatePromise;
    p.$root = PrommyGlobal.$root;
    return p;
}

interface PrivatePromise {
    $isPromise?: true;
    $root: PrommyRoot;
    $pushed?: boolean;
}

// TODO it may be possible to modify the prototype constructor
// https://stackoverflow.com/a/9267343
// Don't think I can for Promise though...

function isPromise(value: any): value is Promise<unknown> & PrivatePromise {
    return value?.$isPromise;
}

function isPromiseLike(value: any): value is PromiseLike<unknown> {
    return value?.then;
}

const Promise_ctor = Promise;
const Promise_then = Promise.prototype.then;
const Promise_all = Promise.all;
const Promise_race = Promise.race;
const Promise_allSettled = Promise.allSettled;
const Promise_any = Promise.any;
const Promise_resolve = Promise.resolve;
const Promise_reject = Promise.reject;

function redefinePromise() {
    // globalThis.Promise = function (this: Promise<unknown> & PrivatePromise, executor) {
    //     const p = new Promise_ctor(executor) as Promise<unknown> & PrivatePromise;
    //     p.$root = PrommyGlobal.$root;
    //     return p;
    // } as any;

    Object.defineProperties(Promise.prototype, {
        then: {
            value: function (this: Promise<unknown> & PrivatePromise, onfulfilled?, onrejected?) {
                return Promise_then.call(this,
                    onfulfilled && ((value) => {
                        PrommyGlobal.$root = this.$root;
                        const result = onfulfilled(value);
                        if (isPromise(result)) {
                            result.$root = this.$root;
                        }
                        else if (isPromiseLike(result)) {
                            // TODO I think a Prommy can be constructed from it
                            console.error("Don't know how to handle this case!");
                        }
    
                        return result;
                    }),
                    // TODO not sure if this is correct
                    onrejected);
            },
            configurable: true,
        },
        $isPromise: {
           value: true, 
        }
    });

    Promise.all = (values) => {
        const p = Promise_all(values);
        (p as any as PrivatePromise).$root = PrommyGlobal.$root;
        return p;
    }

    Promise.race = (values) => {
        const p = Promise_race(values);
        (p as any as PrivatePromise).$root = PrommyGlobal.$root;
        return p;
    }

    Promise.allSettled = (values) => {
        const p = Promise_allSettled(values);
        (p as any as PrivatePromise).$root = PrommyGlobal.$root;
        return p;
    }

    Promise.any = (values) => {
        const p = Promise_any(values);
        (p as any as PrivatePromise).$root = PrommyGlobal.$root;
        return p;
    }

    Promise.resolve = () => {
        const p = Promise_resolve();
        (p as any as PrivatePromise).$root = PrommyGlobal.$root;
        return p;
    }

    Promise.reject = () => {
        const p = Promise_reject();
        (p as any as PrivatePromise).$root = PrommyGlobal.$root;
        return p;
    }
}

interface AwaitedPrommyResult {
    $value: unknown;
    $root: PrommyRoot;
}

function isAwaitedPrommyResult(value: any): value is AwaitedPrommyResult {
    // @ts-expect-error
    return Boolean((value as AwaitedPrommyResult)?.$root?.$isPrommyRoot);
}

function $pop(awaitedResult: unknown) {
    if (isAwaitedPrommyResult(awaitedResult)) {
        PrommyGlobal.$root = awaitedResult.$root;
        return awaitedResult.$value;
    }

    // TODO i dont know if this should happen
    ErrorReporter.reportSubsystemError('PrommyGlobal.$pop', new Error('PrommyGlobal.$pop() should only be called with the result of an awaited Prommy'));
    return awaitedResult;
}

function $push(promise: PromiseLike<unknown> & PrivatePromise) {
    if (promise.$pushed)
        return promise;
    if (!isPromise(promise)) {
        // TODO I think a Prommy can be constructed from it
        console.error("Don't know how to handle this case!");
    }
    const p = Promise_then.call(promise, $value => ({ $value, $root: promise.$root })) as Promise<unknown> & PrivatePromise;
    p.$pushed = true;
    return p;
}

export class PrommyRoot {
    private readonly $isPrommyRoot = true;

    readonly context: any;
    private _promise: Promise<unknown>;
    readonly name: string;

    constructor(executor: () => Promise<unknown>, context: any) {
        this.name = `PrommyRoot ${rootIds++} (${executor.toString().substring(0, 12)})`;
        this.context = context;

        const previous = PrommyGlobal.$root;
        PrommyGlobal.$root = this;
        this._promise = executor().catch(e => {});
        PrommyGlobal.$root = previous;
    }
}

let rootIds = 0;

export const PrommyContext = {
    current() {
        return PrommyGlobal.$root.context;
    }
}