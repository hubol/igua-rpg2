import { Environment } from "../../environment";

let userHasGestured = false;

export const AudioContextSafety = {
    get canAudioContextBeCreated() {
        return !Environment.requiresUserGestureForSound || userHasGestured;
    },

    receiveGestures(el: HTMLElement) {
        const onGesture = () => {
            userHasGestured = true;
            for (const event of userGestureEvents) {
                el.removeEventListener(event, onGesture);
            }
        };

        for (const event of userGestureEvents) {
            el.addEventListener(event, onGesture);
        }
    },
};

// https://stackoverflow.com/a/56388462
const userGestureEvents = [
    "change",
    "click",
    "contextmenu",
    "dblclick",
    "mouseup",
    "pointerup",
    "reset",
    "submit",
    "touchend",
];
