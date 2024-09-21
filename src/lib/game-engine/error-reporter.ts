const defaultErrorAnnouncer = {
    onUnhandledError(error: any) {
        console.error("Unhandled error\n\n", error);
    },
    onSubsystemError(subsystem: string, error: any, ...context: any[]) {
        const args = ["Error in " + subsystem + "\n\n", error];
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

    reportUnhandledError(error: any) {
        try {
            this.announcer.onUnhandledError(error);
        }
        catch (e) {
            console.error("Unexpected error while reporting unhandled error to announcer!");
        }
    }

    reportSubsystemError(subsystem: string, error: any, ...context: any[]) {
        this.announcer.onSubsystemError(subsystem, error, ...context);
    }

    reportDevOnlyState(error: any, ...context: any[]) {
        this.announcer.onSubsystemError("Dev-Only State", error, ...context);
    }
}

export const ErrorReporter = new ErrorReporterImpl();
