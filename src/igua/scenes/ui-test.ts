import { EscapeTickerAndExecute } from "../../lib/game-engine/asshat-ticker";
import { findSceneByName } from "../core/scene/find-scene-by-name";
import { sceneStack } from "../globals";
import { objUiButton } from "../ui/framework/obj-ui-button";
import { objUiPage, objUiPageRouter } from "../ui/framework/obj-ui-page";
import { objUiCheckboxInput } from "../ui/iguana-designer/components/obj-ui-checkbox-input";

export function UiTest() {
    const router = objUiPageRouter({ maxHeight: 256 }).show();

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
            objUiButton('Nothing 4', () => console.log('Nothing 4')).at(16, 128 + 33),
            objUiButton('Nothing 5', () => console.log('Nothing 5')).at(16, 128 + 66),
            objUiButton('Nothing 6', () => console.log('Nothing 6')).at(16, 128 + 99),
            objUiButton('Nothing 7', () => console.log('Nothing 7')).at(16, 128 + 33 + 99),
            objUiButton('Nothing 8', () => console.log('Nothing 8')).at(16, 128 + 66 + 99),
            objUiButton('Nothing 9', () => console.log('Nothing 9')).at(16, 128 + 99 + 99),
            objUiButton('Nothing 10', () => console.log('Nothing 10')).at(16, 128 + 33 + 99 + 99),
            objUiCheckboxInput('Test', { value: false }).at(16, 128 + 66 + 99 + 99),
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