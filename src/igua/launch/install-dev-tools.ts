import { createDebugKey } from "../../lib/game-engine/debug/debug-key";
import { createDebugPanel } from "../../lib/game-engine/debug/debug-panel";
import { WarningToast } from "../../lib/game-engine/warning-toast";
import { IguaAudio } from "../core/igua-audio";
import { SceneLibrary } from "../core/scene/scene-library";
import { layers, sceneStack } from "../globals";

export function installDevTools() {
    // @ts-expect-error
    const el = document.body.appendChild(createDebugPanel(layers._root));
    createDebugKey('KeyM', 'globalMute', (x, keydown) => {
        IguaAudio.globalGain = x ? 0 : 1;
        if (keydown)
            WarningToast.show(x ? 'Muted' : 'Unmuted', '^_^');
    });

    const sceneSwitcherEl = createSceneSwitcherEl();
    el.prepend(sceneSwitcherEl);
}

function createSceneSwitcherEl() {
    const selectEl = document.createElement('select');

    const noChoiceString = 'no-choice';

    selectEl.onchange = () => {
        if (selectEl.value !== noChoiceString)
            sceneStack.replace(SceneLibrary.findByName(selectEl.value), { useGameplay: false });
    };

    const noChoiceOptionEl = document.createElement('option');
    noChoiceOptionEl.textContent = '<Choose Scene>';
    noChoiceOptionEl.value = noChoiceString;
    selectEl.appendChild(noChoiceOptionEl);

    for (const name of SceneLibrary.getNames()) {
        const optionEl = document.createElement('option');
        optionEl.textContent = name;
        optionEl.value = name;
        selectEl.appendChild(optionEl);
    }

    return selectEl;
}