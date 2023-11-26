let oggSupport: boolean;

function getOggSupport() {
    if (oggSupport !== undefined)
        return oggSupport;

    // https://stackoverflow.com/a/1514759
    const audioEl = document.createElement('audio');
    return oggSupport = typeof audioEl.canPlayType === "function" &&
        audioEl.canPlayType("audio/ogg") !== "";
}

export const Capabilities = {
    get oggSupport() {
        return getOggSupport();
    }
}

export class CapabilitiesError extends Error {
    constructor(message: string) {
        super(message);
    }
}