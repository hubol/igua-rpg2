import { ConnectedInput } from "../../../iguana/connected-input";
import { objUiButton } from "../../framework/obj-ui-button";

export type ObjUiDesignerInputBase = ReturnType<typeof objUiDesignerInputBase>;

export function objUiDesignerInputBase(text: string, binding: ConnectedInput.Binding<unknown>, onPress: () => unknown, width = 96, height = 30) {
    return objUiButton(text, onPress, width, height)
    .merge({ note: '', noteOnConflict: '' })
    .step(btn => btn.note = binding.hasConflict ? btn.noteOnConflict : '')
}