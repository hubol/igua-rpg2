import { Container } from "pixi.js";
import { SceneStack } from "../lib/game-engine/scene-stack";
import { engine } from "./globals";
import { AsshatTicker } from "../lib/game-engine/asshat-ticker";

interface IguaSceneMeta {
    useGameplay: false;
}

let sceneStage: Container;

function createIguaScene(source: Function, meta: IguaSceneMeta) {
    if (!sceneStage)
        sceneStage = engine.stage.addChild(new Container());

    const ticker = new AsshatTicker();
    const stage = sceneStage.addChild(new Container().withTicker(ticker));

    return {
        source,
        stage,
        ticker,
    }
}

export type IguaScene = ReturnType<typeof createIguaScene>;

export class IguaSceneStack extends SceneStack<IguaSceneMeta, IguaScene> {
    constructor(private readonly _setScene: (scene: IguaScene) => void) {
        super();
        console.log(this);
    }

    protected convert<T>(populateSceneFn: () => T, meta: IguaSceneMeta) {
        const iguaScene = createIguaScene(populateSceneFn, meta);

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

        scene.stage.visible = true;
        this._setScene(scene);
    }
}
