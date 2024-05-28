import { UserGesture } from "../../browser/user-gesture";
import { Environment } from "../../environment";

export const AudioContextSafety = {
    get canAudioContextBeCreated() {
        return !Environment.requiresUserGestureForSound || UserGesture.hasGestured;
    },
}
