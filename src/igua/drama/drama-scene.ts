import { BLEND_MODES } from "pixi.js";
import { layers } from "../globals";
import { SceneChanger } from "../systems/scene-changer";

export function* change(sceneChanger: SceneChanger) {
    layers.overlay.solid.blendMode = BLEND_MODES.SUBTRACT;
    yield layers.overlay.solid.fadeIn(500);
    sceneChanger.changeScene();
    yield layers.overlay.solid.fadeOut(500);
}

export const DramaScene = {
    change,
};
