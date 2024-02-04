import { AsshatInput, KeyboardControls } from "../../lib/game-engine/input/asshat-input";

const actions = ['MoveLeft', 'MoveRight', 'Duck', 'Jump', 'Interact',
    'InventoryMenuToggle', 'PauseMenuToggle', 'MenuEscape',
    'SelectRight', 'SelectDown', 'SelectLeft', 'SelectUp', 'Confirm', 'CastSpell'] as const;

type Action = typeof actions[number];

const keyboardControls: KeyboardControls<Action> = {
    Confirm: "Space",
    Duck: "ArrowDown",
    Interact: "ArrowUp",
    InventoryMenuToggle: "KeyU",
    Jump: "Space",
    CastSpell: "KeyQ",
    MenuEscape: "Escape",
    MoveLeft: "ArrowLeft",
    MoveRight: "ArrowRight",
    PauseMenuToggle: "Escape",
    SelectDown: "ArrowDown",
    SelectLeft: "ArrowLeft",
    SelectRight: "ArrowRight",
    SelectUp: "ArrowUp"
}

const input = new AsshatInput<Action>(keyboardControls);

export const Input: Pick<AsshatInput<Action>, 'isDown' | 'isUp' | 'justWentDown' | 'justWentUp'> = input;
export const InputPoller = input;