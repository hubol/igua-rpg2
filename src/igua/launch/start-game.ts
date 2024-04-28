import { SceneLibrary } from "../core/scene/scene-library";
import { sceneStack, startAnimator } from "../globals";

export function startGame() {
    sceneStack.push(SceneLibrary.findByName('PlayerTest'), { useGameplay: false });
    startAnimator();
}