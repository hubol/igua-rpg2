import {autoDetectRenderer} from "pixi.js";

export function createPixiRenderer(rendererOptions: Parameters<typeof autoDetectRenderer<HTMLCanvasElement>>[0]) {
    const renderer = autoDetectRenderer<HTMLCanvasElement>(rendererOptions);
    console.log('PixiRenderer', renderer);
    return renderer;
}

export type PixiRenderer = ReturnType<typeof createPixiRenderer>;
