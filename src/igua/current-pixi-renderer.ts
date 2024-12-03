import { PixiRenderer } from "../lib/game-engine/pixi-renderer";

export let renderer: PixiRenderer;

export function setCurrentPixiRenderer(_renderer: PixiRenderer) {
    renderer = _renderer;
}
