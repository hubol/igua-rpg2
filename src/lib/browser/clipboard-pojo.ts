import { RethrownError } from "../rethrown-error";

export const ClipboardPojo = {
    async read<T = Record<string, any>>(): Promise<T> {
        const text = await navigator.clipboard.readText();
        try {
            const result = (0, eval)("const __result__ = " + text + "; __result__;");
            if (typeof result !== "object") {
                throw new Error("Clipboard text did not evaluate to a JavaScript object");
            }
            return result;
        }
        catch (e) {
            throw new RethrownError("Failed to evaluate clipboard text as JavaScript object", e);
        }
    },
};
