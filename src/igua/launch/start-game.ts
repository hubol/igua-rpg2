import { SceneLibrary } from "../core/scene/scene-library";
import { sceneStack } from "../globals";

export function startGame() {
    sceneStack.push(SceneLibrary.findByName('PlayerTest'), { useGameplay: false });
}