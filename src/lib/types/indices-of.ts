// https://www.danielfullstack.com/article/i-discovered-this-cool-typescript-trick
type ToNumber<Key extends PropertyKey> = Key extends `${infer Index extends number}` ? Index : never;
export type IndicesOf<TArray extends readonly any[]> = ToNumber<keyof TArray>;
