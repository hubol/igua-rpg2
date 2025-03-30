import { Logging } from "../logging";

export enum LogNature {
    Debug = "Debug",
    MisconfiguredError = "Misconfigured",
    AssertFailedError = "AssertFailed",
    ContractViolatedError = "ContractViolated",
    UnexpectedError = "Unexpected",
    UnhandledError = "Unhandled",
}

const defaultLogTarget = {
    onDebug(source: string, message: string, ...context: any[]) {
        const args = [...Logging.badge(source), message];
        if (context.length) {
            args.push("\n\nContext:\n", ...context);
        }

        console.trace(...args);
    },
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
    target: LogTarget = defaultLogTarget;

    logInfo(subsystem: string, message: string, ...context: any[]) {
        console.log(...Logging.badge(subsystem, "info"), message, ...context);
    }

    logDebug(subsystem: string, message: string, ...context: any[]) {
        this.target.onDebug(subsystem, message, ...context);
    }

    logUnhandledError(source: string, error: any) {
        try {
            this.target.onError(LogNature.UnhandledError, source, error);
        }
        catch (e) {
            console.error("Unexpected error while logging unhandled error to logTarget!");
        }
    }

    logMisconfigurationError(subsystem: string, error: Error, ...context: any[]) {
        this.target.onError(LogNature.MisconfiguredError, subsystem, error, ...context);
    }

    logAssertError(subsystem: string, error: Error, ...context: any[]) {
        this.target.onError(LogNature.AssertFailedError, subsystem, error, ...context);
    }

    logContractViolationError(subsystem: string, error: Error, ...context: any[]) {
        this.target.onError(LogNature.ContractViolatedError, subsystem, error, ...context);
    }

    logUnexpectedError(subsystem: string, error: Error, ...context: any[]) {
        this.target.onError(LogNature.UnexpectedError, subsystem, error, ...context);
    }
}

export const Logger = new LoggerImpl();
