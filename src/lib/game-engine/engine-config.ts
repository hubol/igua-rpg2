import { Container } from "pixi.js";
import { PixiRenderer } from "./pixi-renderer";
import { SceneStack } from "./scene-stack";

interface EngineConfigType {
    readonly renderer: PixiRenderer;
    readonly sceneStack: SceneStack<unknown, unknown>;
    readonly showDefaultStage: Container;
    readonly worldStage: Container;
}

export function setEngineConfig(engineConfig: EngineConfigType) {
    EngineConfig = engineConfig;
}

export let EngineConfig: EngineConfigType = {
    get renderer() {
        throw new Error("EngineConfig.renderer is not implemented!");
        return undefined as any;
    },
    get sceneStack() {
        throw new Error("EngineConfig.sceneStack is not implemented!");
        return undefined as any;
    },
    get showDefaultStage() {
        throw new Error("EngineConfig.showDefaultStage is not implemented!");
        return undefined as any;
    },
    get worldStage() {
        throw new Error("EngineConfig.worldStage is not implemented!");
        return undefined as any;
    },
};
