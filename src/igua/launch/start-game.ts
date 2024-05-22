import { Environment } from "../../lib/environment";
import { LevelEditor } from "../../lib/game-engine/level-editor/editor";
import { SceneLibrary } from "../core/scene/scene-library";
import { IguaLevelFactoryMap } from "../editor/editor-config";
import { layers, scene, sceneStack, startAnimator } from "../globals";

export function startGame() {
    if (Environment.isEditor) {
        sceneStack.push(() => {}, { useGameplay: false });
        const editor = new LevelEditor(IguaLevelFactoryMap, scene.root);
        editor.create('Block', 256, 256);
        editor.create('Block', 512, 512);
        editor.setBrushKind('Block');
        console.log(editor);
    }
    else {
        sceneStack.push(SceneLibrary.findByName('PlayerTest'), { useGameplay: false });
    }
    startAnimator();
}