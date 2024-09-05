import { Container } from "pixi.js";
import { SceneStack } from "./scene-stack";
import { AsshatZoneContext } from "./asshat-zone";

interface EngineConfigType {
    readonly sceneStack: SceneStack<unknown, unknown>;
    readonly showDefaultStage: Container;
    readonly assertFailedAsshatZoneContext: AsshatZoneContext;
}

export function setEngineConfig(engineConfig: EngineConfigType) {
    EngineConfig = engineConfig;
}

export let EngineConfig: EngineConfigType = {
    get sceneStack() {
        throw new Error('EngineConfig.sceneStack is not implemented!');
        return undefined as any;
    },
    get showDefaultStage() {
        throw new Error('EngineConfig.showDefaultStage is not implemented!');
        return undefined as any;
    },
    get assertFailedAsshatZoneContext() {
        throw new Error('EngineConfig.assertFailedAsshatZoneContext is not implemented!');
        return undefined as any;
    },
}
