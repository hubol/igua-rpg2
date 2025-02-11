export enum LogNature {
    Info = "Info",
    MisconfiguredError = "Misconfigured",
    AssertFailedError = "AssertFailed",
    ContractViolatedError = "ContractViolated",
    UnexpectedError = "Unexpected",
    UnhandledError = "Unhandled",
}

const defaultLogTarget = {
    onError(nature: LogNature, source: string, error: any, ...context: any[]) {
        const args = [nature + " Error in " + source + "\n\n", error];
        if (context.length) {
            args.push("\n\nContext:\n", ...context);
        }

        console.error(...args);
    },
};

export type LogTarget = Readonly<typeof defaultLogTarget>;

export const DefaultLogTarget: LogTarget = defaultLogTarget;

class LoggerImpl {
    logTarget: LogTarget = defaultLogTarget;

    logUnhandledError(source: string, error: any) {
        try {
            this.logTarget.onError(LogNature.UnhandledError, source, error);
        }
        catch (e) {
            console.error("Unexpected error while logging unhandled error to logTarget!");
        }
    }

    logMisconfigurationError(subsystem: string, error: Error, ...context: any[]) {
        this.logTarget.onError(LogNature.MisconfiguredError, subsystem, error, ...context);
    }

    logAssertError(subsystem: string, error: Error, ...context: any[]) {
        this.logTarget.onError(LogNature.AssertFailedError, subsystem, error, ...context);
    }

    logContractViolationError(subsystem: string, error: Error, ...context: any[]) {
        this.logTarget.onError(LogNature.ContractViolatedError, subsystem, error, ...context);
    }

    logUnexpectedError(subsystem: string, error: Error, ...context: any[]) {
        this.logTarget.onError(LogNature.UnexpectedError, subsystem, error, ...context);
    }
}

export const Logger = new LoggerImpl();
