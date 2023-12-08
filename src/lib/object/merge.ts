import { Pojo } from "../types/pojo";

export function merge<T, U extends Pojo>(target: T, source: U): T & U {
    return Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) as T & U;
}
