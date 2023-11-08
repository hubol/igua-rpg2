import {autoDetectRenderer, Container, IRenderer} from "pixi.js";
import {Animator} from "./animator";

type HtmlCanvasRenderer = IRenderer<HTMLCanvasElement>; 

export class GameEngine {
    readonly stage = new Container();
    readonly render: HtmlCanvasRenderer['render'];
    readonly canvasElement: HTMLCanvasElement;

    private readonly _renderer: HtmlCanvasRenderer;

    constructor(
        readonly animator: Animator,
        rendererOptions: Parameters<typeof autoDetectRenderer<HTMLCanvasElement>>[0]) {
            this._renderer = autoDetectRenderer(rendererOptions);
            this.render = (displayObject, options) => this._renderer.render(displayObject, options);
            this.canvasElement = this._renderer.view;
            console.log(this);
    }
}
