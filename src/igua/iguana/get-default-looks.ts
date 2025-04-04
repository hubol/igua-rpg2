import { IguanaLooks } from "./looks";

export function getDefaultLooks(): IguanaLooks.Serializable {
    return {
        head: {
            color: 0xCCAE0A,
            placement: { x: 0, y: 0 },
            crest: {
                shape: 0,
                color: 0xCC2C42,
                placement: { x: 0, y: 0 },
                flipV: false,
                flipH: false,
                behind: true,
            },
            eyes: {
                placement: { x: 0, y: 0 },
                gap: 1,
                tilt: 0,
                pupils: {
                    mirrored: true,
                    placement: { x: 0, y: 0 },
                },
                left: {
                    sclera: {
                        // TODO shape? color?
                    },
                    eyelid: {
                        color: 0xA38A00,
                        placement: 0,
                    },
                    pupil: {
                        shape: 0,
                        color: 0x9957AF,
                        placement: { x: 0, y: 0 },
                        flipH: false,
                    },
                },
                right: {
                    sclera: {
                        // TODO shape? color?
                    },
                    eyelid: {
                        color: 0xA38A00,
                        placement: 0,
                    },
                    pupil: {
                        shape: 0,
                        color: 0x9957AF,
                        placement: { x: 0, y: 0 },
                        flipH: false,
                    },
                },
            },
            horn: {
                shape: -1,
                color: 0xCC2C42,
                placement: { x: 0, y: 0 },
            },
            mouth: {
                shape: 0,
                color: 0x9957AF,
                placement: { x: 0, y: 0 },
                flipV: false,
            },
        },
        body: {
            color: 0xCC70BB,
            placement: { x: 0, y: 0 },
            tail: {
                shape: 0,
                color: 0x9957AF,
                placement: { x: 0, y: 0 },
                club: {
                    shape: -1,
                    color: 0x0C4CCC,
                    placement: { x: 0, y: 0 },
                },
            },
        },
        feet: {
            fore: {
                left: {
                    shape: 0,
                    color: 0x0C4CCC,
                    claws: {
                        color: 0x92B233,
                        shape: 0,
                        placement: 4,
                    },
                },
                right: {
                    shape: 0,
                    color: 0x0C4CCC,
                    claws: {
                        color: 0x92B233,
                        shape: 0,
                        placement: 4,
                    },
                },
            },
            hind: {
                left: {
                    shape: 0,
                    color: 0x0C4CCC,
                    claws: {
                        color: 0x92B233,
                        shape: 0,
                        placement: 4,
                    },
                },
                right: {
                    shape: 0,
                    color: 0x0C4CCC,
                    claws: {
                        color: 0x92B233,
                        shape: 0,
                        placement: 4,
                    },
                },
            },
            gap: 2,
            backOffset: 6,
        },
    };
}
