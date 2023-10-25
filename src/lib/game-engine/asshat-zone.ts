import { CancellationToken } from "../promise/cancellation-token";
import { Zone } from "../zone";
import { IAsshatTicker } from "./asshat-ticker";

interface AsshatZoneContext {
    cancellationToken: CancellationToken;
    ticker: IAsshatTicker;
}

export const AsshatZone = new Zone<AsshatZoneContext>('HubolZone');