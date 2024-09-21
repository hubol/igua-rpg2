import { RequireCapability } from "../../browser/capabilities";
import { intervalWait } from "../../browser/interval-wait";
import { Environment } from "../../environment";
import { Force } from "../../types/force";
import { AudioContextSafety } from "./audiocontext-safety";

export let AsshatAudioContext: AudioContext;

let called = false;

interface InitializeAsshatAudioContextArgs {
    gestureEl: () => HTMLElement;
    cleanup: (gestureEl: HTMLElement) => Promise<void> | void;
}

export async function initializeAsshatAudioContext(args: InitializeAsshatAudioContextArgs) {
    if (called) {
        throw new Error("Multiple calls to initializeAsshatAudioContext() detected!");
    }
    called = true;

    RequireCapability("webAudio");

    let gestureEl = Force<HTMLElement>();

    if (Environment.requiresUserGestureForSound) {
        gestureEl = args.gestureEl();
        await requestUserGestureForAudioContext(gestureEl);
    }

    AsshatAudioContext = new AudioContext();

    if (gestureEl) {
        await args.cleanup(gestureEl);
    }
}

async function requestUserGestureForAudioContext(gestureEl: HTMLElement) {
    AudioContextSafety.receiveGestures(gestureEl);
    await intervalWait(() => AudioContextSafety.canAudioContextBeCreated);
}
