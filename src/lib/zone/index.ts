import { newScope, PSD } from "./dexie/promise";

type InternalContext = { key: string };

const _contexts: Record<string, object> = {};

export class Zone<TContext extends object> {
  private _contextsCreatedCount = 0;

  constructor(readonly name: string) { }

  get context() {
    return _contexts[(PSD as any as InternalContext).key] as TContext;
  }

  run(fn: () => unknown, context: TContext) {
    this._contextsCreatedCount += 1;
    const key = this.name + '_' + this._contextsCreatedCount;

    const internalContext: InternalContext = { key };

    _contexts[key] = context;
    const scope: Promise<void> = newScope(fn, internalContext);
    return scope.finally(() => delete _contexts[key]);
  }

}
