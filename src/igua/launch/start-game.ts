import { Environment } from "../../lib/environment";
import { LevelEditor } from "../../lib/game-engine/level-editor/editor";
import { SceneLibrary } from "../core/scene/scene-library";
import { IguaLevelFactoryMap } from "../editor/editor-config";
import { scene, sceneStack, startAnimator } from "../globals";

export function startGame() {
    if (Environment.isEditor) {
        sceneStack.push(() => {}, { useGameplay: false });
        
        setTimeout(async () => {
            await LevelEditor.create(IguaLevelFactoryMap, scene.root);
        })
    }
    else {
        sceneStack.push(SceneLibrary.findByName('PlayerTest'), { useGameplay: false });
    }
    startAnimator();
}