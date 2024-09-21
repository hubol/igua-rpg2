// https://stackoverflow.com/a/61132308
// Thanks
// Modified to allow for my absurd number aliases

export type DeepPartial<T> = T extends number ? number
    : T extends object ? { [P in keyof T]?: DeepPartial<T[P]> }
    : T;
