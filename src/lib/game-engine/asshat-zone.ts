import { Logging } from "../logging";
import { CancellationError, CancellationToken } from "../promise/cancellation-token";
import { AsshatMicrotaskFactory } from "./promise/asshat-microtasks";
import { IAsshatTicker } from "./asshat-ticker";
import { ErrorReporter } from "./error-reporter";
import { EngineConfig } from "./engine-config";
import { Prommy, PrommyContext } from "../zone/prommy";

interface AsshatZoneContext {
    cancellationToken: CancellationToken;
    ticker: IAsshatTicker;
}

const alwaysPredicate = () => true;

class AsshatZoneImpl {
    constructor() {
        console.log(...Logging.componentArgs(this));
    }

    get context() {
        const context = PrommyContext.current();
        if (!context) {
            ErrorReporter.reportDevOnlyState(new Error('AsshatZone.context was falsy, using EngineConfig.showDefaultStage'));
            return EngineConfig.showDefaultStage as any;
        }

        return context;
      }

    run(fn: () => unknown, context: AsshatZoneContext) {
        return Prommy.createRoot<void>(async () => {
            try {
                await new Prommy<void>((resolve, reject) => {
                    const microtask = AsshatMicrotaskFactory.create(alwaysPredicate, context, resolve as any, reject);
                    context.ticker.addMicrotask(microtask);
                });
                await fn();
            }
            catch (e) {
                handleAsshatZoneError(e);
            }
        }, context)
        // return new Promise<void>((resolve, reject) => {
        //     const microtask = AsshatMicrotaskFactory.create(alwaysPredicate, context, resolve as any, reject);
        //     context.ticker.addMicrotask(microtask);
        // })
        // .then(() => Prommy.createRoot<void>(fn as any, context))
        // .catch(handleAsshatZoneError)
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