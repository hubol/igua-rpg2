// Adapted from
// https://github.com/vlcn-io/model/blob/main/ts/packages/zone/src/index.ts

import { newScope, PSD } from "./dexie/helpers/promise.js";

type InternalContext = { key: string };

export class Zone<TContext extends object> {
  private _contextsCreatedCount = 0;
  private static readonly _contexts: Record<string, object> = {};

  constructor(readonly name: string) {

  }

  get context() {
    return Zone._contexts[(PSD as InternalContext).key] as TContext;
  }

  async run(fn: () => unknown, context: TContext) {
    this._contextsCreatedCount += 1;
    const key = this.name + '_' + this._contextsCreatedCount;

    const internalContext: InternalContext = { key };

    Zone._contexts[key] = context;
    const scope: Promise<void> = newScope(fn, internalContext);
    await scope;
    // TODO try/catch ?
    delete Zone._contexts[key];
  }

}
