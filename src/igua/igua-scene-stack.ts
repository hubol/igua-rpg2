import { SceneStack } from "../lib/game-engine/scene-stack";
import { AsshatTicker } from "../lib/game-engine/asshat-ticker";
import { IguaLayers } from "./igua-layers";
import { TickerContainer } from "../lib/game-engine/ticker-container";
import { Logging } from "../lib/logging";

interface IguaSceneMeta {
    useGameplay: false;
}

function createIguaScene(layers: IguaLayers, source: Function, meta: IguaSceneMeta) {
    const ticker = new AsshatTicker();
    const stage = layers.scene.addChild(new TickerContainer(ticker));

    return {
        source,
        stage,
        ticker,
    }
}

export type IguaScene = ReturnType<typeof createIguaScene>;

export class IguaSceneStack extends SceneStack<IguaSceneMeta, IguaScene> {
    constructor(
        private readonly _layers: IguaLayers,
        private readonly _setScene: (scene: IguaScene) => void) {
            super();
            console.log(...Logging.componentArgs(this));
    }

    protected convert<T>(populateSceneFn: () => T, meta: IguaSceneMeta) {
        const iguaScene = createIguaScene(this._layers, populateSceneFn, meta);

        return {
            ...iguaScene,
            populateScene: populateSceneFn,
        }
    }

    protected dispose(scene: IguaScene): void {
        scene.stage.destroy();
    }

    protected onScenesModified(): void {
        for (let i = 0; i < this.scenes.length - 1; i += 1)
            this.scenes[i].stage.visible = false;

        const scene = this.scenes.last;

        if (!scene)
            throw new Error('IguaSceneStack does not support empty stack!');

        scene.stage.visible = true;
        this._setScene(scene);
    }
}
