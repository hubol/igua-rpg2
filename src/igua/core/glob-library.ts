import { Logging } from "../../lib/logging";
import { Null } from "../../lib/types/null";

type EsbuildGlobModules = { default: any };

export class GlobLibrary<T> {
    constructor(
        private readonly _modules: EsbuildGlobModules,
        private readonly _entityName: string,
        private readonly _filter: (value: any, key: string) => value is T,
    ) {
    }

    private _library = Null<Record<string, T>>();

    private _ensureLibrary() {
        if (this._library) {
            return this._library;
        }

        const modules = this._modules.default;

        this._library = {};

        for (const exports of modules) {
            for (const key in exports) {
                const value = exports[key];
                if (this._filter(value, key)) {
                    this._library[key] = value;
                }
            }
        }

        console.log(...Logging.componentArgs(`${this._entityName}Library`, this._library));

        return this._library;
    }

    maybeFindByName(name: string) {
        return this._ensureLibrary()[name] ?? null;
    }

    findByName(name: string) {
        const value = this.maybeFindByName(name);
        if (!value) {
            throw new Error(`Could not find ${this._entityName} with name ${name}`);
        }

        return value;
    }

    private _names = Null<Array<string>>();

    getNames(): ReadonlyArray<string> {
        if (this._names) {
            return this._names;
        }
        return this._names = Object.keys(this._ensureLibrary())
            .sort();
    }
}
