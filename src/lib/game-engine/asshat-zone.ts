import { CancellationToken } from "../promise/cancellation-token";
import { Zone } from "../zone";
import { IAsshatTicker } from "./asshat-ticker";

interface AsshatZoneContext {
    cancellationToken: CancellationToken;
    ticker: IAsshatTicker;
}

class AsshatZoneImpl extends Zone<AsshatZoneContext> {
    constructor() {
        super('AsshatZone');
    }

    run(fn: () => unknown, context: AsshatZoneContext): Promise<void> {
        return super.run(fn, context).catch(handleAsshatZoneError);
    }
}

export const AsshatZone = new AsshatZoneImpl();

function handleAsshatZoneError(e: any) {
    // TODO check for CancellationException
}