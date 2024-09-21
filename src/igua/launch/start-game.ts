import { Environment } from "../../lib/environment";
import { SceneLibrary } from "../core/scene/scene-library";
import { DevStartScene } from "../dev/dev-start-scene";
import { sceneStack, startAnimator } from "../globals";

export function startGame() {
    const sceneName = getStartSceneName();
    sceneStack.push(SceneLibrary.findByName(sceneName), { useGameplay: false });
    startAnimator();
}

function getStartSceneName() {
    return (Environment.isDev && DevStartScene.name)
        ? DevStartScene.name
        : "scnPotteryHouse";
}
