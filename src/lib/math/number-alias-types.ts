type ForceAliasName<T> = T & { readonly __t?: unique symbol };

export type Polar = ForceAliasName<number>;
export type Unit = ForceAliasName<number>;
export type Integer = ForceAliasName<number>;
export type ZeroOrGreater = ForceAliasName<number>;

export type Seconds = ForceAliasName<number>;
