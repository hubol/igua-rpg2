import { JsonDirectory } from "../../lib/browser/json-directory";
import { KeyValueDb, openDb } from "../../lib/browser/key-value-db";
import { Environment } from "../../lib/environment";
import { LevelEditor } from "../../lib/game-engine/level-editor/editor";
import { SceneLibrary } from "../core/scene/scene-library";
import { IguaLevelFactoryMap } from "../editor/editor-config";
import { layers, scene, sceneStack, startAnimator } from "../globals";

export function startGame() {
    // window.openDb = (db: string) => KeyValueDb.open(db);
    // window.openJsonDirectory = (name: string) => JsonDirectory.create(name);

    if (Environment.isEditor) {
        sceneStack.push(() => {}, { useGameplay: false });
        
        setTimeout(async () => {
            await LevelEditor.create(IguaLevelFactoryMap, scene.root);
            // editor.create('Block', 256, 256);
            // editor.create('Block', 512, 512);
            // editor.setBrushKind('Block');
        })
    }
    else {
        sceneStack.push(SceneLibrary.findByName('PlayerTest'), { useGameplay: false });
    }
    startAnimator();
}