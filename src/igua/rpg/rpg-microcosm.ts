export class RpgMicrocosmUnsafeBase {
    public _state: any = null;
}

// @ts-expect-error Also don't care
export abstract class RpgMicrocosm<TState> extends RpgMicrocosmUnsafeBase {
    // @ts-expect-error Don't care
    protected readonly _state: TState;
    abstract createState(): TState;
}
