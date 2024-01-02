import {autoDetectRenderer} from "pixi.js";
import { Logging } from "../logging";

export function createPixiRenderer(rendererOptions: Parameters<typeof autoDetectRenderer<HTMLCanvasElement>>[0]) {
    const renderer = autoDetectRenderer<HTMLCanvasElement>(rendererOptions);
    console.log(...Logging.componentArgs('PixiRenderer', renderer));
    return renderer;
}

export type PixiRenderer = ReturnType<typeof createPixiRenderer>;
