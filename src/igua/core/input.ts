import { AsshatInput, InputModalityType } from "../../lib/game-engine/input/asshat-input";
import { GamepadControl, GamepadControls, StandardMapping } from "../../lib/game-engine/input/gamepad-controls";
import { MappedGamepad } from "../../lib/game-engine/input/mapped-gamepad";
import { KeyboardControls, MappedKeyboard } from "../../lib/game-engine/input/mapped-keyboard";
import { layers } from "../globals";

const actions = [
    "MoveLeft",
    "MoveRight",
    "Duck",
    "Jump",
    "Interact",
    "InventoryMenuToggle",
    "PauseMenuToggle",
    "MenuEscape",
    "SelectRight",
    "SelectDown",
    "SelectLeft",
    "SelectUp",
    "Confirm",
    "CastSpell",
    "WorldMap_Interact",
    "WorldMap_MoveUp",
    "WorldMap_MoveDown",
] as const;

export type Action = typeof actions[number];

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
    SelectUp: "ArrowUp",
    WorldMap_Interact: "Space",
    WorldMap_MoveUp: "ArrowUp",
    WorldMap_MoveDown: "ArrowDown",
};

const { button, axis, axisUnit } = GamepadControl;

const gamepadControls: GamepadControls<Action> = {
    CastSpell: [button(StandardMapping.Button.Top), button(StandardMapping.Button.BumperRight)],
    Confirm: [button(StandardMapping.Button.Bottom)],
    Duck: [button(StandardMapping.Button.PadDown), button(StandardMapping.Button.BumperLeft)],
    Interact: [button(StandardMapping.Button.PadUp)],
    InventoryMenuToggle: [button(StandardMapping.Button.ControlRight)],
    Jump: [button(StandardMapping.Button.Bottom)],
    MenuEscape: [button(StandardMapping.Button.Right)],
    MoveLeft: [
        button(StandardMapping.Button.PadLeft),
        axis(StandardMapping.Axis.JoystickLeftHorizontal, -1),
        axis(StandardMapping.Axis.JoystickRightHorizontal, -1),
    ],
    MoveRight: [
        button(StandardMapping.Button.PadRight),
        axis(StandardMapping.Axis.JoystickLeftHorizontal, 1),
        axis(StandardMapping.Axis.JoystickRightHorizontal, 1),
    ],
    PauseMenuToggle: [button(StandardMapping.Button.ControlLeft)],
    SelectDown: [
        button(StandardMapping.Button.PadDown),
        axisUnit(StandardMapping.Axis.JoystickLeft, [0, 1]),
        axisUnit(StandardMapping.Axis.JoystickRight, [0, 1]),
    ],
    SelectLeft: [
        button(StandardMapping.Button.PadLeft),
        axisUnit(StandardMapping.Axis.JoystickLeft, [-1, 0]),
        axisUnit(StandardMapping.Axis.JoystickRight, [-1, 0]),
    ],
    SelectRight: [
        button(StandardMapping.Button.PadRight),
        axisUnit(StandardMapping.Axis.JoystickLeft, [1, 0]),
        axisUnit(StandardMapping.Axis.JoystickRight, [1, 0]),
    ],
    SelectUp: [
        button(StandardMapping.Button.PadUp),
        axisUnit(StandardMapping.Axis.JoystickLeft, [0, -1]),
        axisUnit(StandardMapping.Axis.JoystickRight, [0, -1]),
    ],
    WorldMap_Interact: [button(StandardMapping.Button.Bottom)],
    WorldMap_MoveDown: [
        button(StandardMapping.Button.PadDown),
        axis(StandardMapping.Axis.JoystickLeftVertical, 1),
        axis(StandardMapping.Axis.JoystickRightVertical, 1),
    ],
    WorldMap_MoveUp: [
        button(StandardMapping.Button.PadUp),
        axis(StandardMapping.Axis.JoystickLeftVertical, -1),
        axis(StandardMapping.Axis.JoystickRightVertical, -1),
    ],
};

const message = {
    [InputModalityType.Keyboard]: "Using keyboard controls",
    [InputModalityType.Gamepad]: "Using gamepad controls",
};

export class IguaInput extends AsshatInput<Action> {
    constructor() {
        super([new MappedKeyboard(keyboardControls), new MappedGamepad(gamepadControls)]);
    }

    protected onModalityChanged(from: InputModalityType, to: InputModalityType): void {
        layers.overlay.systemMessage.setMessage(message[to]);
    }
}
