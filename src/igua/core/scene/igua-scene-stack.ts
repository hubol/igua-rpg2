import { SceneStack } from "../../../lib/game-engine/scene-stack";
import { AsshatTicker } from "../../../lib/game-engine/asshat-ticker";
import { IguaLayers } from "../igua-layers";
import { TickerContainer } from "../../../lib/game-engine/ticker-container";
import { Logging } from "../../../lib/logging";
import { Container, Graphics } from "pixi.js";
import { merge } from "../../../lib/object/merge";
import { forceGameLoop, renderer } from "../../globals";
import { objCamera } from "../../objects/obj-camera";

interface IguaSceneMeta {
    useGameplay: boolean;
}

function createIguaScene(layers: IguaLayers, source: Function, meta: IguaSceneMeta) {
    const ticker = new AsshatTicker();
    const root = layers.scene.addChild(new TickerContainer(ticker, false).named(`Scene: ${source.name}`));

    const background = new Container().named("Background");
    const stage = new Container().named("Stage");

    const camera = objCamera();

    root.addChild(background, stage, camera);

    const backgroundGfx = new Graphics().tinted(0x000000).beginFill(0xffffff).drawRect(
        0,
        0,
        renderer.width,
        renderer.height,
    ).show(background);

    return {
        root,
        source,
        stage,
        camera,
        ticker,
        level: {
            width: renderer.width,
            height: renderer.height,
        },
        style: {
            set backgroundTint(tint: number) {
                backgroundGfx.tint = tint;
            },
        },
    };
}

export type IguaScene = ReturnType<typeof createIguaScene>;

export class IguaSceneStack extends SceneStack<IguaSceneMeta, IguaScene> {
    constructor(
        private readonly _layers: IguaLayers,
        private readonly _setScene: (scene: IguaScene) => void,
    ) {
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
        scene.root.destroy();
    }

    protected onScenesModified(): void {
        for (let i = 0; i < this.scenes.length - 1; i += 1) {
            this.scenes[i].root.visible = false;
        }

        const scene = this.scenes.last;

        if (!scene) {
            return;
        }

        scene.root.visible = true;
        this._setScene(scene);
        forceGameLoop();
    }
}
