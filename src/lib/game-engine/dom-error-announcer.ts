import { elRuntimeErrorsRoot } from "./elements/el-runtime-errors-root";
import { DefaultErrorAnnouncer, ErrorAnnouncer } from "./error-reporter";

export function createDomErrorAnnouncer(): ErrorAnnouncer {
    const errorRoot = createDomErrorRoot();
    document.body.appendChild(errorRoot.el);

    return {
        onSubsystemError(subsystem: string, error: any, ...context: any[]): void {
            DefaultErrorAnnouncer.onSubsystemError(subsystem, error, ...context);
            errorRoot.increaseErrorCountForSubsystem(subsystem, `${error}`);
        },

        onUnhandledError(error: any): void {
            DefaultErrorAnnouncer.onUnhandledError(error);
            errorRoot.increaseErrorCountForSubsystem("Unhandled", `${error}`);
        },
    };
}

function createDomErrorRoot() {
    const el = elRuntimeErrorsRoot();

    const domErrors: Record<string, ReturnType<typeof createDomError>> = {};

    const getDomError = (subsystem: string) => {
        if (!domErrors[subsystem]) {
            const domError = createDomError(subsystem);
            el.appendChild(domError.el);
            domErrors[subsystem] = domError;
        }

        return domErrors[subsystem];
    };

    const increaseErrorCountForSubsystem = (subsystem: string, error: string) => {
        const domError = getDomError(subsystem);
        domError.updateUniqueErrors(error);
        domError.increaseErrorCount();
    };

    return {
        el,
        increaseErrorCountForSubsystem,
    };
}

function createDomError(subsytem: string) {
    const el = document.createElement("div");

    el.className = "error";

    const subsystemEl = document.createElement("div");
    subsystemEl.className = "subsystem";

    const errorCountEl = document.createElement("div");
    errorCountEl.className = "count";

    const uniqueErrorCountEl = document.createElement("div");
    uniqueErrorCountEl.className = "unique_count";

    el.append(subsystemEl, errorCountEl, uniqueErrorCountEl);

    subsystemEl.textContent = subsytem;
    let errorCount = 0;

    const clearErrorCount = () => {
        errorCount = 0;
        uniqueErrors.clear();
        update();
    };

    el.onclick = clearErrorCount;

    const increaseErrorCount = () => {
        errorCount += 1;
        update();
    };

    const uniqueErrors = new Set<string>();

    const updateUniqueErrors = (error: string) => {
        if (uniqueErrors.has(error)) {
            return;
        }
        uniqueErrors.add(error);
        update();
    };

    const update = () => {
        el.classList[errorCount === 0 ? "add" : "remove"]("empty");
        errorCountEl.textContent = "" + errorCount;

        const uniqueErrorCount = uniqueErrors.size;
        uniqueErrorCountEl.textContent = uniqueErrorCount <= 1 ? "" : `(${uniqueErrorCount})`;
        uniqueErrorCountEl.classList[uniqueErrorCount <= 1 ? "add" : "remove"]("empty");
    };

    return {
        el,
        increaseErrorCount,
        updateUniqueErrors,
    };
}
