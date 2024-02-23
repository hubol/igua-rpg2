import { EscapeTickerAndExecute } from "../../lib/game-engine/asshat-ticker";
import { findSceneByName } from "../core/scene/find-scene-by-name";
import { sceneStack } from "../globals";
import { objUiButton } from "../ui/framework/obj-ui-button";
import { objUiPage, objUiPageRouter } from "../ui/framework/obj-ui-page";
import { objUiCheckboxInput } from "../ui/iguana-designer/components/obj-ui-checkbox-input";

export function UiTest() {
    const router = objUiPageRouter().show();

    const gotoSceneTest = () => sceneStack.replace(findSceneByName('SceneTest'), { useGameplay: false });

    function page1() {
        return objUiPage([
            objUiButton('Goto Page 2', () => router.replace(page2())).escape(),
            objUiButton('View test scene (Space bar)', () => { throw new EscapeTickerAndExecute(gotoSceneTest); }, 180).at(0, 48),
            objUiButton('Go on a quest', () => router.push(quest())).at(0, 128),
        ],
        { selectionIndex: 1 });
    }

    function page2() {
        return objUiPage([
            objUiButton('Goto Page 1', () => router.replace(page1())).escape(),
            objUiButton('Nothing 2', () => console.log('Nothing 2')).at(16, 64),
            objUiButton('Nothing 3', () => console.log('Nothing 3')).at(16, 128),
            objUiCheckboxInput('Test', { value: false }).at(16, 192),
        ],
        { selectionIndex: 1 });
    }

    function quest() {
        return objUiPage([
            objUiButton(`Quest level ${router.pages.length}`, () => console.log('hi')),
            objUiButton('Go deeper', () => router.push(quest())).at(16, 64),
            objUiButton('Retreat!', () => router.pop()).escape().at(16, 128),
            objUiCheckboxInput('Test', { value: false }).at(16, 192),
        ],
        { selectionIndex: 1 });
    }

    router.replace(page1());
}