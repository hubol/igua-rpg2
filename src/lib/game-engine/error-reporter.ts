export enum ReportedErrorNature {
    Misconfigured = "Misconfigured",
    AssertFailed = "AssertFailed",
    ContractViolated = "ContractViolated",
    Unexpected = "Unexpected",
    Unhandled = "Unhandled",
}

const defaultErrorAnnouncer = {
    onError(nature: ReportedErrorNature, source: string, error: any, ...context: any[]) {
        const args = [nature + " Error in " + source + "\n\n", error];
        if (context.length) {
            args.push("\n\nContext:\n", ...context);
        }

        console.error(...args);
    },
};

export type ErrorAnnouncer = Readonly<typeof defaultErrorAnnouncer>;

export const DefaultErrorAnnouncer: ErrorAnnouncer = defaultErrorAnnouncer;

class ErrorReporterImpl {
    announcer: ErrorAnnouncer = defaultErrorAnnouncer;

    reportUnhandledError(source: string, error: any) {
        try {
            this.announcer.onError(ReportedErrorNature.Unhandled, source, error);
        }
        catch (e) {
            console.error("Unexpected error while reporting unhandled error to announcer!");
        }
    }

    reportMisconfigurationError(subsystem: string, error: Error, ...context: any[]) {
        this.announcer.onError(ReportedErrorNature.Misconfigured, subsystem, error, ...context);
    }

    reportAssertError(subsystem: string, error: Error, ...context: any[]) {
        this.announcer.onError(ReportedErrorNature.AssertFailed, subsystem, error, ...context);
    }

    reportContractViolationError(subsystem: string, error: Error, ...context: any[]) {
        this.announcer.onError(ReportedErrorNature.ContractViolated, subsystem, error, ...context);
    }

    reportUnexpectedError(subsystem: string, error: Error, ...context: any[]) {
        this.announcer.onError(ReportedErrorNature.Unexpected, subsystem, error, ...context);
    }
}

export const ErrorReporter = new ErrorReporterImpl();
