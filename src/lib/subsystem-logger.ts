export class SubsystemLogger {
    private readonly _prefix: string[];

    constructor(name: string) {
        this._prefix = [`%c${name}`, 'color: #004000; font-weight: bold; padding: 2px 4px; background-color: #f0fff0; border-radius: 3px;'];
    }

    error(...args: any[]) {
        console.error(...this._prefix, ...args);
    }

    log(...args: any[]) {
        console.log(...this._prefix, ...args);
    }

    warn(...args: any[]) {
        console.warn(...this._prefix, ...args);
    }
}