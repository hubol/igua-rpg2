export namespace RpgRegion {
    export const list = ["Indiana", "Ohio", "BetweenIndianaOhio", "Illinois", "Iowa", "OuterSpace"] as const;
    export type Id = typeof list[number];

    export type StartingId = typeof list[0] | typeof list[1];
}
