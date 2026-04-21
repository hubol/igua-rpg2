export abstract class RpgMicrocosmUnsafeBase {
    _state: any = null;
    abstract createState(): any;
}

// @ts-expect-error Also don't care
export abstract class RpgMicrocosm<TState> extends RpgMicrocosmUnsafeBase {
    // @ts-expect-error Don't care
    protected readonly _state: TState;
    protected abstract createState(): TState;
}
