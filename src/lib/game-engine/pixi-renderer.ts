import { autoDetectRenderer, IRenderer, Renderer } from "pixi.js";
import { Environment } from "../environment";
import { Logging } from "../logging";

export function createPixiRenderer(rendererOptions: Parameters<typeof autoDetectRenderer<HTMLCanvasElement>>[0]) {
    // Tiny optimization (about ~15ms every restart)
    // In dev, don't check for WebGL support
    const renderer = Environment.isDev
        ? new Renderer(rendererOptions) as any as IRenderer<HTMLCanvasElement>
        : autoDetectRenderer<HTMLCanvasElement>(rendererOptions);
    console.log(...Logging.componentArgs("PixiRenderer", renderer));
    return renderer;
}

export type PixiRenderer = ReturnType<typeof createPixiRenderer>;
