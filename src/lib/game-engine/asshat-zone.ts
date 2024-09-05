import { Logging } from "../logging";
import { CancellationError, CancellationToken } from "../promise/cancellation-token";
import { AsshatMicrotaskFactory } from "./promise/asshat-microtasks";
import { IAsshatTicker } from "./asshat-ticker";
import { ErrorReporter } from "./error-reporter";
import { EngineConfig } from "./engine-config";
import { PrommyRuntime } from "../zone/prommy";

export interface AsshatZoneContext {
    cancellationToken: CancellationToken;
    ticker: IAsshatTicker;
}

export function assertAsshatZoneContext($c?: AsshatZoneContext) {
    if (!$c) {
        ErrorReporter.reportDevOnlyState(new Error('$c was falsy, somewhere in the stack $c was not passed'));
        return EngineConfig.assertFailedAsshatZoneContext;
    }
    if (PrommyRuntime.isDefaultContext($c)) {
        ErrorReporter.reportDevOnlyState(new Error('$c was the default context, somewhere in the stack a function did not have a $c parameter and passed globalThis.$c'));
        return EngineConfig.assertFailedAsshatZoneContext;
    }
    return $c;
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