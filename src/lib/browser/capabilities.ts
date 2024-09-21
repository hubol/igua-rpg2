let oggSupport: boolean;

function getOggSupport() {
    if (oggSupport !== undefined) {
        return oggSupport;
    }

    // https://stackoverflow.com/a/1514759
    const audioEl = document.createElement("audio");
    return oggSupport = typeof audioEl.canPlayType === "function"
        && audioEl.canPlayType("audio/ogg") !== "";
}

export const Capabilities = {
    get oggSupport() {
        return getOggSupport();
    },
    get webAudio() {
        return "AudioContext" in window;
    },
};

type Capability = keyof typeof Capabilities;
const capabilitiesErrorMessage: Record<Capability, string> = {
    oggSupport: `Your browser does not support the OGG audio format.
Safari is known to not support this format.`,
    webAudio: `Your browser does not support Web Audio API.`,
};

export class CapabilitiesError extends Error {
    constructor(message: string) {
        super(message);
    }
}

export function RequireCapability(capability: Capability) {
    if (!Capabilities[capability]) {
        throw new CapabilitiesError(capabilitiesErrorMessage[capability]);
    }
}
