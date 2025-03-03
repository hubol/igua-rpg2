import { elLogsRoot } from "./elements/el-logs-root";
import { DefaultLogTarget, LogNature, LogTarget } from "./logger";

export class DomLogTarget implements LogTarget {
    readonly logRoot = createDomLogRoot();

    constructor() {
        document.body.appendChild(this.logRoot.el);
    }

    onDebug(source: string, message: string, ...context: any[]): void {
        DefaultLogTarget.onDebug(source, message, ...context);
        this.logRoot.increaseLogCountForSubsystem(LogNature.Debug, source, message);
    }

    onError(nature: LogNature, subsystem: string, error: any, ...context: any[]): void {
        DefaultLogTarget.onError(nature, subsystem, error, ...context);
        this.logRoot.increaseLogCountForSubsystem(nature, subsystem, `${error}`);
    }
}

function createDomLogRoot() {
    const el = elLogsRoot();

    const domLogs: Record<string, Record<LogNature, ReturnType<typeof createDomLog>>> = {};

    const getDomLog = (nature: LogNature, subsystem: string) => {
        if (!domLogs[subsystem]?.[nature]) {
            if (!domLogs[subsystem]) {
                domLogs[subsystem] = {} as any;
            }
            const domLog = createDomLog(nature, subsystem);
            el.appendChild(domLog.el);
            domLogs[subsystem][nature] = domLog;
        }

        return domLogs[subsystem][nature];
    };

    const increaseLogCountForSubsystem = (nature: LogNature, subsystem: string, message: string) => {
        const domLog = getDomLog(nature, subsystem);
        domLog.updateUniqueMessages(message);
        domLog.increaseLogCount();
    };

    return {
        el,
        increaseLogCountForSubsystem,
    };
}

function createDomLog(nature: LogNature, subsytem: string) {
    const el = document.createElement("div");

    el.className = "log";
    el.dataset.nature = nature;

    const natureEl = document.createElement("div");
    natureEl.className = "nature";
    natureEl.textContent = nature;

    const subsystemEl = document.createElement("div");
    subsystemEl.className = "subsystem";

    const messageCountEl = document.createElement("div");
    messageCountEl.className = "count";

    const latestMessageEl = document.createElement("div");
    latestMessageEl.className = "latest";

    const uniqueMessageCountEl = document.createElement("div");
    uniqueMessageCountEl.className = "unique_count";

    el.append(natureEl, subsystemEl, messageCountEl, uniqueMessageCountEl);

    if (nature === LogNature.Debug) {
        el.append(latestMessageEl);
    }

    subsystemEl.textContent = subsytem;
    let messageCount = 0;

    const clearMessageCount = () => {
        latestMessageEl.textContent = "";
        messageCount = 0;
        uniqueMessages.clear();
        update();
    };

    el.onclick = clearMessageCount;

    const increaseLogCount = () => {
        messageCount += 1;
        update();
    };

    const uniqueMessages = new Set<string>();

    const updateUniqueMessages = (message: string) => {
        latestMessageEl.textContent = message;

        if (uniqueMessages.has(message)) {
            return;
        }
        uniqueMessages.add(message);
        update();
    };

    const update = () => {
        el.title = [...uniqueMessages].join("\n");
        el.classList[messageCount === 0 ? "add" : "remove"]("empty");
        messageCountEl.textContent = "" + messageCount;

        const uniqueMessageCount = uniqueMessages.size;
        uniqueMessageCountEl.textContent = uniqueMessageCount <= 1 ? "" : `(${uniqueMessageCount})`;
        uniqueMessageCountEl.classList[uniqueMessageCount <= 1 ? "add" : "remove"]("empty");
    };

    return {
        el,
        increaseLogCount,
        updateUniqueMessages,
    };
}
