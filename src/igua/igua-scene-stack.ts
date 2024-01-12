import { SceneStack } from "../lib/game-engine/scene-stack";
import { AsshatTicker } from "../lib/game-engine/asshat-ticker";
import { IguaLayers } from "./igua-layers";
import { TickerContainer } from "../lib/game-engine/ticker-container";
import { Logging } from "../lib/logging";
import { Container, Graphics } from "pixi.js";
import { merge } from "../lib/object/merge";

interface IguaSceneMeta {
    useGameplay: false;
}

function createIguaScene(layers: IguaLayers, source: Function, meta: IguaSceneMeta) {
    const ticker = new AsshatTicker();
    const root = layers.scene.addChild(new TickerContainer(ticker).named(`Root (${source.name})`));

    const background = new Container().named("Background");
    const stage = new Container().named("Stage");

    root.addChild(background, stage);

    const backgroundGfx = new Graphics().tinted(0x000000).beginFill(0xffffff).drawRect(0, 0, 256, 256).show(background);

    return {
        set backgroundTint(tint: number) {
            backgroundGfx.tint = tint;
        },
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

        return merge(iguaScene, {
            populateScene: populateSceneFn,
        });
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
