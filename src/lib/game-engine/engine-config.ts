import { Container } from "pixi.js";
import { SceneStack } from "./scene-stack";

interface EngineConfigType {
    readonly sceneStack: SceneStack<unknown, unknown>;
    readonly showDefaultStage: Container;
}

export function setEngineConfig(engineConfig: EngineConfigType) {
    EngineConfig = engineConfig;
}

export let EngineConfig: EngineConfigType = {
    get sceneStack() {
        throw new Error("EngineConfig.sceneStack is not implemented!");
        return undefined as any;
    },
    get showDefaultStage() {
        throw new Error("EngineConfig.showDefaultStage is not implemented!");
        return undefined as any;
    },
};
