import { intervalWait } from "../browser/interval-wait";
import { Environment } from "../environment";
import { AudioContextSafety } from "./audiocontext-safety";

export async function requestUserGestureForAudioContext() {
    if (!Environment.requiresUserGestureForSound)
        return;

    const el = document.createElement('div');
    el.textContent = 'Please Click';
    document.body.appendChild(el);
    AudioContextSafety.receiveGestures(el);

    await intervalWait(() => AudioContextSafety.canAudioContextBeCreated);

    el.remove();
}