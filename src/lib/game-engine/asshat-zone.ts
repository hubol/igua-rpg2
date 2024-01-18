import { Logging } from "../logging";
import { CancellationError, CancellationToken } from "../promise/cancellation-token";
import { Zone } from "../zone";
import { AsshatMicrotaskFactory } from "./asshat-microtasks";
import { IAsshatTicker } from "./asshat-ticker";
import { ErrorReporter } from "./error-reporter";

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
        await new Promise<void>((resolve, reject) => {
            const microtask = AsshatMicrotaskFactory.create(alwaysPredicate, context.cancellationToken, resolve, reject);
            context.ticker.addMicrotask(microtask);
        })

        return super.run(fn, context).catch(handleAsshatZoneError);
    }
}

export const AsshatZone = new AsshatZoneImpl();

let handledCancellationErrorsCount = 0;

function handleAsshatZoneError(e: any) {
    if (e instanceof CancellationError) {
        handledCancellationErrorsCount += 1;
        return;
    }

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