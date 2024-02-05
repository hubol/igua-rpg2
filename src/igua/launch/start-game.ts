import { findSceneByName } from "../core/scene/find-scene-by-name";
import { sceneStack } from "../globals";

export function startGame() {
    sceneStack.push(findSceneByName('UiTest'), { useGameplay: false });
}