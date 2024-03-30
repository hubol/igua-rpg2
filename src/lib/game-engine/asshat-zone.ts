import { Logging } from "../logging";
import { CancellationError, CancellationToken } from "../promise/cancellation-token";
import { Zone } from "../zone";
import { AsshatMicrotaskFactory } from "./promise/asshat-microtasks";
import { IAsshatTicker } from "./asshat-ticker";
import { ErrorReporter } from "./error-reporter";
import { DexiePromise } from "../zone/dexie/promise";

interface AsshatZoneContext {
    cancellationToken: CancellationToken;
    ticker: IAsshatTicker;
}

const alwaysPredicate = () => true;

class AsshatZoneImpl extends Zone<AsshatZoneContext> {
    constructor() {
        super('AsshatZone');
        console.log(...Logging.componentArgs(this));
    }

    async run(fn: () => unknown, context: AsshatZoneContext): Promise<void> {
        try {
            await new DexiePromise((resolve, reject) => {
                const microtask = AsshatMicrotaskFactory.create(alwaysPredicate, context.cancellationToken, resolve as any, reject);
                context.ticker.addMicrotask(microtask);
            });
            await super.run(fn, context);
        }
        catch (e) {
            handleAsshatZoneError(e);
        }
    }
}

export const AsshatZone = new AsshatZoneImpl();

let handledCancellationErrorsCount = 0;

function handleAsshatZoneError(e: any) {
    if (e instanceof CancellationError) {
        handledCancellationErrorsCount += 1;
        return;
    }

    // TODO should EscapeTickerAndExecute errors be handled here?

    ErrorReporter.reportSubsystemError('AsshatZone', e);
}

export const AsshatZoneDiagnostics = {
    printHandledCancellationErrors() {
        if (handledCancellationErrorsCount === 0)
            return;
    
        console.debug(`Handled ${handledCancellationErrorsCount} CancellationError(s)`)
        handledCancellationErrorsCount = 0;
    }
}