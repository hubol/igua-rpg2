import { SceneStack } from "../lib/game-engine/scene-stack";

interface IguaSceneMeta {
    useGameplay: false;
}

function createIguaScene(source: Function, meta: IguaSceneMeta) {
    return {
        source,
    }
}

export type IguaScene = ReturnType<typeof createIguaScene>;

export class IguaSceneStack extends SceneStack<IguaSceneMeta, IguaScene> {
    constructor(private readonly _setScene: (scene: IguaScene) => void) {
        super();
    }

    protected convert<T>(populateSceneFn: () => T, meta: IguaSceneMeta) {
        const iguaScene = createIguaScene(populateSceneFn, meta);

        return {
            ...iguaScene,
            populateScene: populateSceneFn,
        }
    }

    protected dispose(scene: IguaScene): void {
        throw new Error("Method not implemented.");
    }

    protected onScenesModified(): void {
        this._setScene(this.scenes.last);
    }
}
