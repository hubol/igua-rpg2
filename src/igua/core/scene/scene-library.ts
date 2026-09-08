import { GlobLibrary } from "../glob-library";

type SceneFn = () => unknown;

export const SceneLibrary = new GlobLibrary<SceneFn>(
    require(`../../scenes/**/*.ts`),
    "Scene",
    (value): value is SceneFn => typeof value === "function",
);
