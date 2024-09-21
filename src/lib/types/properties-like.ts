export type PropertiesLike<T, P> = Pick<
    T,
    {
        [K in keyof T]: T[K] extends P ? K : never;
    }[keyof T]
>;
