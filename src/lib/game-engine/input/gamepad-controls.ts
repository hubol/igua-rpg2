import { Vector } from "../../math/vector-type";

export type GamepadControls<TAction extends string> = {
    [index in TAction]: GamepadControlType[];
};

function button(index: number) {
    return { index, kind: "button" as const };
}

function axis(index: number, sign: 1 | -1) {
    return { index, sign, kind: "axis" as const };
}

function axisUnit(indices: number[], unit: Vector) {
    return { indices, unit, kind: "axisUnit" as const };
}

type ButtonControl = ReturnType<typeof button>;
type AxisControl = ReturnType<typeof axis>;
type AxisUnitControl = ReturnType<typeof axisUnit>;
export type GamepadControlType = ButtonControl | AxisControl | AxisUnitControl;

export const GamepadControl = {
    button,
    axis,
    axisUnit,
};

export const StandardMapping = {
    Button: {
        Bottom: 0,
        Right: 1,
        Left: 2,
        Top: 3,
        BumperLeft: 4,
        BumperRight: 5,
        TriggerLeft: 6,
        TriggerRight: 7,
        ControlLeft: 8,
        ControlRight: 9,
        JoystickLeft: 10,
        JoystickRight: 11,
        PadUp: 12,
        PadDown: 13,
        PadLeft: 14,
        PadRight: 15,
        ControlMiddle: 16,
    },
    Axis: {
        JoystickLeftHorizontal: 0,
        JoystickLeftVertical: 1,
        JoystickRightHorizontal: 2,
        JoystickRightVertical: 3,
        JoystickLeft: [0, 1],
        JoystickRight: [2, 3],
    },
};
