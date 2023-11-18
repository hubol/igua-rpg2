// Crude attempt to allow only objects that are not class instances
// I have added some keys from common class instances to try to enforce this at compile time
type Pojo = Record<string, any> & {
    _x?: undefined; // PixiJS ObservablePoint
    _bounds?: undefined; // PixiJS DisplayObject
    _parentID?: undefined; // PixiJS Transform
}

export function merge<T, U extends Pojo>(target: T, source: U): T & U {
    return Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) as T & U;
}
