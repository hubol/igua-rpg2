import { Logging } from "../logging";
import { CancellationError, CancellationToken } from "../promise/cancellation-token";
import { AsshatMicrotaskFactory } from "./promise/asshat-microtasks";
import { IAsshatTicker } from "./asshat-ticker";
import { ErrorReporter } from "./error-reporter";

interface AsshatZoneContext {
    cancellationToken: CancellationToken;
    ticker: IAsshatTicker;
}

const alwaysPredicate = () => true;

class AsshatZoneImpl {
    constructor() {
        console.log(...Logging.componentArgs(this));
    }

    run(fn: () => unknown, $c: AsshatZoneContext) {
        new Promise<void>((resolve, reject) => {
            const microtask = AsshatMicrotaskFactory.create(alwaysPredicate, $c, resolve as any, reject);
            $c.ticker.addMicrotask(microtask);
        })
        .then(fn)
        .catch(handleAsshatZoneError)
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