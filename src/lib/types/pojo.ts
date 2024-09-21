// Crude attempt to allow only objects that are not class instances
// I have added some keys from common class instances to try to enforce this at compile time
export type Pojo = Record<string, any> & {
    _x?: undefined; // PixiJS ObservablePoint
    _bounds?: undefined; // PixiJS DisplayObject
    _parentID?: undefined; // PixiJS Transform
};
