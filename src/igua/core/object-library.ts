import { DisplayObject } from "pixi.js";
import { GlobLibrary } from "./glob-library";

type ObjectFactoryFn = () => DisplayObject;

export const ObjectLibrary = new GlobLibrary<ObjectFactoryFn>(
    require("../objects/**/*.ts"),
    "Object",
    (value, key): value is ObjectFactoryFn =>
        typeof value === "function" && key.startsWith("obj") && (value as Function).length === 0,
);
