import { DefaultErrorAnnouncer, ErrorAnnouncer } from "./error-reporter";

export function createDomErrorAnnouncer(): ErrorAnnouncer {
    const errorRoot = createDomErrorRoot();
    document.body.appendChild(errorRoot.el);

    return {
        onSubsystemError(subsystem: string, error: any, ...context: any[]): void {
            DefaultErrorAnnouncer.onSubsystemError(subsystem, error, ...context);
            errorRoot.increaseErrorCountForSubsystem(subsystem);
        },
    
        onUnhandledError(error: any): void {
            DefaultErrorAnnouncer.onUnhandledError(error);
            errorRoot.increaseErrorCountForSubsystem('Unhandled');
        }
    }
}

function createDomErrorRoot() {
    const el = document.createElement('div');
    el.id = 'runtime_errors';

    const domErrors: Record<string, ReturnType<typeof createDomError>> = {};

    const getDomError = (subsystem: string) => {
        if (!domErrors[subsystem]) {
            const domError = createDomError(subsystem);
            el.appendChild(domError.el);
            domErrors[subsystem] = domError;
        }

        return domErrors[subsystem];
    }

    const increaseErrorCountForSubsystem = (subsystem: string) => {
        const domError = getDomError(subsystem);
        domError.increaseErrorCount();
    }

    return {
        el,
        increaseErrorCountForSubsystem,
    }
}

function createDomError(subsytem: string) {
    const el = document.createElement('div');

    el.className = 'error';

    const subsystemEl = document.createElement('div');
    subsystemEl.className = 'subsystem';

    const errorCountEl = document.createElement('div');
    errorCountEl.className = 'count';

    el.append(subsystemEl, errorCountEl);

    subsystemEl.textContent = subsytem;
    let errorCount = 0;

    const clearErrorCount = () => {
        errorCount = 0;
        update();
    }

    el.onclick = clearErrorCount;

    const increaseErrorCount = () => {
        errorCount += 1;
        update();
    }

    const update = () => {
        el.classList[errorCount === 0 ? 'add' : 'remove']('empty');
        errorCountEl.textContent = '' + errorCount;
    }

    return {
        el,
        increaseErrorCount,
    }
}
