// Adapted from
// https://github.com/vlcn-io/model/blob/7d3850fc5d1f0b2ed52d721edb898fccc21cb90f/ts/packages/zone/src/index.ts

import { newScope, PSD } from "./dexie/helpers/promise";

type InternalContext = { key: string };

const _contexts: Record<string, object> = {};

export class Zone<TContext extends object> {
  private _contextsCreatedCount = 0;

  constructor(readonly name: string) {

  }

  get context() {
    return _contexts[(PSD as any as InternalContext).key] as TContext;
  }

  async run(fn: () => unknown, context: TContext) {
    this._contextsCreatedCount += 1;
    const key = this.name + '_' + this._contextsCreatedCount;

    const internalContext: InternalContext = { key };

    _contexts[key] = context;
    const scope: Promise<void> = newScope(fn, internalContext);
    await scope;
    // TODO try/catch ?
    delete _contexts[key];
  }

}
