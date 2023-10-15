import {autoDetectRenderer, Container, ICanvas, IRenderer} from "pixi.js";
import {Animator} from "./animator";

export class GameEngine {
    readonly stage = new Container();
    readonly render: IRenderer<ICanvas>['render'];
    readonly canvasElement: IRenderer<ICanvas>['view'];

    constructor(
        readonly animator: Animator,
        rendererOptions: Parameters<typeof autoDetectRenderer>[0]) {
            const renderer = autoDetectRenderer(rendererOptions);
            this.render = renderer.render.bind(renderer);
            this.canvasElement = renderer.view;
    }
}
