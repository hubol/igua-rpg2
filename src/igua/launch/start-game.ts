import { sceneStack } from "../globals";
import { SceneTest } from "../scenes/game";

export function startGame() {
    sceneStack.push(SceneTest, { useGameplay: false });
}