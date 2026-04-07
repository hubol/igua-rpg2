import { DisplayObject } from "pixi.js";
import { ask } from "../drama/show";
import { sceneStack } from "../globals";
import { Rpg } from "../rpg/rpg";
import { scnIguanaDesigner } from "../scenes/scn-iguana-designer";
import { SceneChanger } from "../systems/scene-changer";
import { mxnCutscene } from "./mxn-cutscene";

interface MxnInteractChangePlayerAppearanceArgs {
    checkpointName: string;
}

export function mxnInteractChangePlayerAppearance(obj: DisplayObject, args: MxnInteractChangePlayerAppearanceArgs) {
    const popSceneChanger = SceneChanger.create({
        sceneName: Rpg.character.position.sceneName,
        checkpointName: args.checkpointName,
    });

    return obj
        .mixin(mxnCutscene, function* () {
            if (!(yield* ask("Change your appearance?"))) {
                return;
            }

            sceneStack.replace(() => scnIguanaDesigner(Rpg.character.looks, popSceneChanger));
        });
}
