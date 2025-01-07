import { elRuntimeErrorsRoot } from "./elements/el-runtime-errors-root";
import { DefaultErrorAnnouncer, ErrorAnnouncer, ReportedErrorNature } from "./error-reporter";

export class DomErrorAnnouncer implements ErrorAnnouncer {
    readonly errorRoot = createDomErrorRoot();

    constructor() {
        document.body.appendChild(this.errorRoot.el);
    }

    onError(nature: ReportedErrorNature, subsystem: string, error: any, ...context: any[]): void {
        DefaultErrorAnnouncer.onError(nature, subsystem, error, ...context);
        this.errorRoot.increaseErrorCountForSubsystem(nature, subsystem, `${error}`);
    }
}

function createDomErrorRoot() {
    const el = elRuntimeErrorsRoot();

    const domErrors: Record<string, Record<ReportedErrorNature, ReturnType<typeof createDomError>>> = {};

    const getDomError = (nature: ReportedErrorNature, subsystem: string) => {
        if (!domErrors[subsystem]?.[nature]) {
            if (!domErrors[subsystem]) {
                domErrors[subsystem] = {} as any;
            }
            const domError = createDomError(nature, subsystem);
            el.appendChild(domError.el);
            domErrors[subsystem][nature] = domError;
        }

        return domErrors[subsystem][nature];
    };

    const increaseErrorCountForSubsystem = (nature: ReportedErrorNature, subsystem: string, error: string) => {
        const domError = getDomError(nature, subsystem);
        domError.updateUniqueErrors(error);
        domError.increaseErrorCount();
    };

    return {
        el,
        increaseErrorCountForSubsystem,
    };
}

function createDomError(nature: ReportedErrorNature, subsytem: string) {
    const el = document.createElement("div");

    el.className = "error";
    el.dataset.nature = nature;

    const natureEl = document.createElement("div");
    natureEl.className = "nature";
    natureEl.textContent = nature;

    const subsystemEl = document.createElement("div");
    subsystemEl.className = "subsystem";

    const errorCountEl = document.createElement("div");
    errorCountEl.className = "count";

    const uniqueErrorCountEl = document.createElement("div");
    uniqueErrorCountEl.className = "unique_count";

    el.append(natureEl, subsystemEl, errorCountEl, uniqueErrorCountEl);

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
