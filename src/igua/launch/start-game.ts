import { findSceneByName } from "../find-scene-by-name";
import { sceneStack } from "../globals";

export function startGame() {
    sceneStack.push(findSceneByName('SceneTest'), { useGameplay: false });
}