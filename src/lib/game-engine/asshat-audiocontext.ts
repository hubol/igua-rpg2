import { intervalWait } from "../browser/interval-wait";
import { Environment } from "../environment";
import { AudioContextSafety } from "./audiocontext-safety";

export let AsshatAudioContext: AudioContext;

let called = false;

interface InitializeAsshatAudioContextArgs {
    gestureEl: () => HTMLElement;
    cleanup: (gestureEl: HTMLElement) => Promise<void> | void;
}

export async function initializeAsshatAudioContext(args: InitializeAsshatAudioContextArgs) {
    if (called)
        throw new Error('Multiple calls to initializeAsshatAudioContext() detected!');
    called = true;

    if (Environment.requiresUserGestureForSound) {
        const gestureEl = args.gestureEl();
        await requestUserGestureForAudioContext(gestureEl);
        await args.cleanup(gestureEl);
    }

    AsshatAudioContext = new AudioContext();
}

async function requestUserGestureForAudioContext(gestureEl: HTMLElement) {
    AudioContextSafety.receiveGestures(gestureEl);
    await intervalWait(() => AudioContextSafety.canAudioContextBeCreated);
}